const survey = {
    contact: [
        {
            type: "TEXT",
            tag: "lcFirstName",
            prompt: "First Name",
            required: true
        },
        {
            type: "TEXT",
            tag: "lcLastName",
            prompt: "Last Name",
            required: true
        },
        {
            type: "TEXT",
            tag: "lcCompany",
            prompt: "Company",
            required: false
        }        
    ],

    qualifiers: [ 
        {
            type: "PICKONE",
            tag: "lcFollow",
            prompt: "How should we follow-up?",
            required: false,
            options : [
                {
                    tag: "lcFollow_1",
                    prompt: "Meeting"
                },
                {
                    tag: "lcFollow_2",
                    prompt: "Salesperson call"
                },
                {
                    tag: "lcFollow_3",
                    prompt: "Receive proposal"
                },
                {
                    tag: "lcFollow_4",
                    prompt: "Product demo"
                },
                {
                    tag: "lcFollow_5",
                    prompt: "No follow-up"
                }
            ]
        }, 
        {
            type: "PICKONE",
            tag: "lcTimeframe",
            prompt: "What is your timeframe?",
            required: false,
            options : [
                {
                    tag: "lcTimeframe_1",
                    prompt: "Immediate Need"
                },
                {
                    tag: "lcTimeframe_2",
                    prompt: "30 days"
                },
                {
                    tag: "lcTimeframe_3",
                    prompt: "3 months"
                },
                {
                    tag: "lcTimeframe_4",
                    prompt: "6 months"
                },
                {
                    tag: "lcTimeframe_5",
                    prompt: "1 year"
                }
            ]
        },  
        {
            type: "PICKONE",
            tag: "lcRole",
            prompt: "What is your role in the decision?",
            required: false,
            options : [
                {
                    tag: "lcRole_1",
                    prompt: "Final Say"
                },
                {
                    tag: "lcRole_2",
                    prompt: "Purchase Decision"
                },
                {
                    tag: "lcRole_3",
                    prompt: "Recommendation"
                },
                {
                    tag: "lcRole_4",
                    prompt: "Influence"
                },
                {
                    tag: "lcRole_5",
                    prompt: "Partial Interest"
                }
            ]
        },     
        {
            type: "CHECKBOX",
            tag: "lcInfoRequest",
            prompt: "Information requested?",
            required: false,
            options : [
                {
                    tag: "lcInfoRequest_Yes",
                    prompt: ""
                }
            ]
        }               
    ],

    leadRanking: [
        {
            type: 'PICKONE',
            tag: 'lcLeadRank',
            prompt: 'Lead Ranking',
            required : false,
            options : [
                {
                    tag: 'lcRankHot',
                    prompt: 'Hot'
                },
                {
                    tag: 'lcRankWarm',
                    prompt: 'Warm'
                },
                {
                    tag: 'lcRankCold',
                    prompt: 'Cold'
                }
            ]
        }
    ],

    notes: [
        {
            type: 'TEXTAREA',
            tag: 'lcNotes',
            prompt: 'Notes',
            required : false
        }
    ]
};

export default { survey };