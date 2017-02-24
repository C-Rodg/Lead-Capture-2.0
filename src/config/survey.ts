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
            required: true
        },
        {
            type: "TEXT",
            tag: "lcEmail",
            prompt: "Email",
            required: false
        },
        {
            type: "TEXT",
            tag: "lcAddress1",
            prompt: "Address",
            required: false
        },
        {
            type: "TEXT",
            tag: "lcCity",
            prompt: "City",
            required: false
        },
        {
            type: "TEXT",
            tag: "lcState",
            prompt: "State",
            required: false
        },
        {
            type: "TEXT",
            tag: "lcCountry",
            prompt: "Country",
            required: false
        }
    ],

    qualifiers: [
        {
            type: "TEXT",
            tag: "lcProductList",
            prompt: "Company Product List",
            required: false
        },
        {
            type: "CHECKBOX",
            tag: "lcPrivacy",
            prompt: "Yes, I agree to the privacy policy for this event?",
            required: false,
            options : [
                {
                    tag: "lcPrivacy_Yes",
                    prompt: ""
                }
            ]
        },
        {
            type: "TEXT",
            tag: "lcControllers",
            prompt: "What types of controllers do you use? And where do you think you'll use them?",
            required: true
        },
        {
            type: "PICKONE",
            tag: "lcProducts",
            prompt: "What type of products are you interested in?",
            required: true,
            options : [
                {
                    tag: "lcProducts_1",
                    prompt: "Validar Demo"
                },
                {
                    tag: "lcProducts_2",
                    prompt: "iOS Lead Capture"
                },
                {
                    tag: "lcProducts_3",
                    prompt: "Registration Check-in Application"
                },
                {
                    tag: "lcProducts_4",
                    prompt: "iOS Session Scanning"
                },
                {
                    tag: "lcProducts_5",
                    prompt: "Lead Import"
                },
                {
                    tag: "lcProducts_6",
                    prompt: "Everything"
                }
            ]
        },
        {
            type: "PICKONE",
            tag: "lcColor",
            prompt: "What is the best color?",
            required: false,
            options: [
                {
                    tag: "lcColor_1",
                    prompt: "Blue"
                },
                {
                    tag: "lcColor_2",
                    prompt: "Red"
                },
                {
                    tag: "lcColor_3",
                    prompt: "Green"
                },
                {
                    tag: "lcColor_4",
                    prompt: "Purple"
                }
            ]
        },
        {
            type: "PICKMANY",
            tag: "lcBands",
            prompt: "What bands do you enjoy?",
            required: true,
            options: [
                {
                    tag: "lcBands_1",
                    prompt: "ACDC"
                },
                {
                    tag: "lcBands_2",
                    prompt: "Rolling Stone"
                },
                {
                    tag: "lcBands_3",
                    prompt: "Jimi Hendrix"
                },
                {
                    tag: "lcBands_4",
                    prompt: "Bob Dylan"
                },
                {
                    tag: "lcBands_5",
                    prompt: "The Beatles"
                }
            ]
        },
        {
            type: "PICKONE",
            tag: "lcContactMe",
            prompt: "Should we contact you?",
            required: false,
            options: [
                {
                    tag: "lcContactMe_1",
                    prompt: "Yes"
                },
                {
                    tag: "lcContactMe_2",
                    prompt: "No"
                }
            ]
        },
        {
            type: "TEXT",
            tag: "lcConcerns",
            prompt: "Any other concerns?",
            required: false
        }
    ],

    leadRanking: [
        {
            type: 'PICKONE',
            tag: 'lcLeadRank',
            prompt: 'Lead Ranking',
            required : true,
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
            required : true
        }
    ]
};

export default { survey };