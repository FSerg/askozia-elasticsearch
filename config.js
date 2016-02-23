module.exports = {

    "agi_port": process.env.AGI_PORT,
    "agi_host": process.env.AGI_HOST,
    "agi_login": process.env.AGI_LOGIN,
    "agi_pass": process.env.AGI_PASS,

    "elasticHost": process.env.EL_HOST,
    "elasticPort": process.env.EL_PORT || 9200,
    "elasticIndexName": process.env.EL_INDEX_NAME || "askozia-cdr"

};
