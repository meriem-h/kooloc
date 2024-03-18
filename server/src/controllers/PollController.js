const db = require('../models/index')

exports.readAll = async (req, res) => {
    const Polls = await db.Poll.findAll({
        include: "choices",
        where: {
            houseShareId: req.user.houseShareId
        }
    });
    res.json(Polls);
}


exports.readOne = async (req, res) => {
    let poll = await db.Poll.findOne({
        where: { id: req.params.id },
        include: [
            {
                model: db.Suggestion,
                as: 'choices',
            }

        ]
    })
    let votes = await db.Vote.findAll({
        where: {
            userId: req.user.id,
            pollId: req.params.id
        }
    })
    let voteIds = []
    votes.forEach(v => {
        voteIds.push(v.suggestionId)
    });
    const alreadyVoted = votes.length > 0
    res.json({ poll, alreadyVoted, voteIds })
}

exports.getChart = async (req, res) => {
    // console.log(req.params)
    const votes = await db.Vote.findAll({
        where: {
            pollId: req.params.id
        },
        order: [
            ['suggestionId', 'ASC']
        ]
    })

    const poll = await db.Poll.findAll({
        where: {
            id: req.params.id
        },

    })

    const suggestion = await db.Suggestion.findAll({
        where: {
            pollId: req.params.id
        },
        order: [
            ['id', 'ASC']
        ]
    })

    let choices = [];

    let votesData = []

    JSON.parse(JSON.stringify(suggestion)).map(s => {
        // console.log(s.title)
        choices.push(s.title)
        votesData.push({
            choix: s.title,
            id: s.id,
            nbVotes: 0
        })
    })

    JSON.parse(JSON.stringify(votes)).map(v => {
        let vote = votesData.find(function (voteData) {
            return voteData.id === v.suggestionId;
        });

        vote.nbVotes += 1
    })

    const data = {
        pollQuestion: poll[0].question,
        choices: choices,
        votes: votesData

    }

    res.json({ data })
}


