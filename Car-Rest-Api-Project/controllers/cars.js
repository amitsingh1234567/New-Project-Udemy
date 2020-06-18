const Car = require('../models/car');
const User = require('../models/user');

module.exports = {
    index: async (req, res, next) => {
        //Get All the Cars
        try{
            const cars = await Car.find({});
            res.status(200).json(cars);
        }catch(err){
            console.log('Problem in finding Cars ' + err)
        }    
    },

    newCar: async (req, res, next) => {
       
        // 1. Find the actual seller
        const seller = await User.findById(req.value.body.seller)

        // 2. Create a new car
        const newCar = req.value.body;
        delete newCar.seller;
       
        const car = new Car(newCar);
        car.seller = seller._id;
        await car.save()

        // 3. Add newly created car to the actual seller
        seller.cars.push(car)
        await seller.save();

        // We're done!
        res.status(200).json(car);
    },
    getCar: async (req, res, next) => {
        
        try{
           const car = await Car.findById(req.value.params.carId)
            res.status(200).json(car);
        }catch(err){
            console.log(err)
        }
    },
    replaceCar: async (req, res, next) => {
        const { carId } = req.value.params;
        const newCar = req.value.body;
        try{
          const result = await Car.findByIdAndUpdate(carId, newCar)
          res.status(200).json({success:true})
        }catch(err){
            console.log(err)
        }
    },
    updateCar: async (req, res, next) =>  {
        const { carId } = req.value.params;
        const newCar = req.value.body;
        try{
          const result = await Car.findByIdAndUpdate(carId, newCar)
          res.status(200).json({success:true})
        }catch(err){
            console.log(err)
        }
    },
    deleteCar: async (req, res, next) => {
        const { carId } = req.value.params;
        // Get a car
        const car = await Car.findById(carId);
        const sellerId = car.seller;
        // Get a seller
        const seller = await User.findById(sellerId);
        // Remove the car
           await car.remove();
           
        // Remove car from the seller's selling list
        // /******************************************* 
        seller.cars.forEach((element, index) => {

            if(car.id == element){      
               const x = seller.cars.splice(index, 1);
               seller.save().then(data => console.log(data))
            }               
        });
        // *********************************************/

        // seller.cars.pull(car);
        
        // try{
        //     const sellerData = await seller.save()
        //     res.status(200).json(sellerData)
        // }catch(err){
        //     console.log(err)
        // }   
    }
}