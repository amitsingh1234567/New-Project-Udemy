const express = require('express');
var Pusher = require('pusher');
const router = express.Router();
const Vote = require('../models/Vote');

var pusher = new Pusher({
    appId: '766335',
    key: 'a20c71b01bfee6adc325',
    secret: '933397652c3de518c8b8',
    cluster: 'ap2',
    // encrypted: true,
    useTLS: true,
  });

router.get('/', (req, res) => {
    Vote.find().then(votes => {
        res.json({success:true, votes:votes})
    });
});

router.post('/', (req, res) => {
    const newVote = {os:req.body.os,  points:1  }
    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points:parseInt(vote.points),
            os:vote.os
        });
        res.json({success: true, message:'Thanku for voting'})
    });
  
});

module.exports = router;

