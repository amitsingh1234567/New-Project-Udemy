const Tour = require('./../models/tourModel');
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('./../utilities/appError');

module.exports = {
    aliasTopTours: (req, res, next) => {
        req.query.limit = '5';
        req.query.sort = '-ratingAverage,price';
        req.query.fields = 'name,price,ratingAverage,summary,difficulty';
        next();
    },
    
    getAllTours: catchAsync( async (req, res, next) => {  
           // EXECUTE QUERY
           const features = new APIFeatures(Tour.find(), req.query)
           .filter()
           .sort()
           .limitFields()
           .pagination();
           const tours = await features.query;

        //    .where('duration')
        //    .equals(4)
        //    .where('difficulty')
        //    .equals('easy')

           // SEND RESPONCE
           res.status(200).json(
            {
             success: true,
             length: tours.length,
             data: {
             tours: tours
            }
            });
    }),

    createTour: catchAsync( async (req, res, next) => {
           const newTour = await Tour.create(req.body);
           res.status(200)
           .json(
               {
                   success:true,
                   data:{
                       tour: newTour
                   }
               }
           );
    }),

    getTour: catchAsync( async (req, res, next) => {
            const tour = await Tour.findById(req.params.id);
            if(!tour){
               return next(new AppError('No tour found with this ID', 404))
            }
            res.status(200)
            .json(
                {
                    success:true,
                    data:{
                        tour: tour
                    }
                }
            );
    }),

    updateTour: catchAsync( async (req, res, next) => {
            const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
            if(!tour){
                return next(new AppError('No tour found with this ID', 404))
             }
            res.status(200)
            .json(
                {
                    success:true,
                    data:{
                     tour
                    }
                }
            );
    }),

    deleteTour: catchAsync( async (req, res, next) => {
            const tour = await Tour.findByIdAndDelete(req.params.id)
            if(!tour){
                return next(new AppError('No tour found with this ID', 404))
             }
            res.status(200)
            .json(
                {
                    success:true,
                    data:{
                     tour
                    }
                }
            );
    }),

    getTourStats: catchAsync( async (req, res) => {
            const stats = await Tour.aggregate([
                {
                    $match: {ratingAverage: {$gte: 4}}    
                },
                {
                    $group:{
                        _id: {$toUpper: '$difficulty'},                        
                        numTours:{ $sum: 1},
                        numRatings:{ $sum: '$ratingQuentity'},
                        avgRating: {$avg: '$ratingAverage'},
                        avgPrice: {$avg: '$price'},
                        minPrice: {$min: '$price'},
                        maxPrice: {$max: '$price'},
                    }
                },
                {
                    $sort:{ avgPrice: -1}
                },
                {
                    $match: {_id: {$ne: 'EASY'}}    
                }, 
            ]);
            res.status(200).json(
                {
                    success: true,
                    data: {
                        stats
                    }
                });
    }),

    getMonthlyPlan: catchAsync( async (req, res) => {
            const year = req.params.year * 1;
            const plan = await Tour.aggregate([
                {
                    $unwind: '$startDates'
                },
                {
                    $match: {
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        }
                    }
                },
                /***********---->  As a Refrence code writen by Me  <----**********/
                // {
                //     $project:{
                //         month: { $month: "$startDates" },
                //         dayOfWeek: { $dayOfWeek: "$startDates" },
                //         week: { $week: "$startDates" },
                //         Dates:{ $dateToString: { format: "%d-%m-%Y", date: "$startDates" } }
                //     }
                // },
                {
                    $group:{
                        _id: { $month: "$startDates" },
                        numTourStarts: {$sum: 1},
                        tours: {$push: '$name'},                            
                    }
                },
                {
                    $addFields: {month: '$_id'}
                },
                {
                    $project: {
                    _id: 0
                    },
                },
                {
                    $sort:{numTourStarts: 1}
                }
            ]);
            res.status(200).json(
                {
                    success: true,
                    length: plan.length,
                    data: {
                        plan
                    }
                });
    })

    // checkID:(req, res, next, val) => {
    //     console.log(`Tower id is: ${val}`);
    //     if(req.params.id * 1 > 10){
    //         return res.status(404).json({
    //             message: 'Invalid ID!'
    //         });
    //     }
    //     next();
    // },

    // checkBody:(req, res, next) => {
    //     if(!req.body.name || !req.body.price){
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Missing name and price'
    //         });
    //     }
    //     next();
    // },
};