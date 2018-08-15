exports.formatUserData = (userData) => {
    return userData.map((userDatum) => {
        return {
            ...userDatum
        }
    })
}

exports.formatTopicData = (topicData) => {
   return topicData.map((topicDatum) => { 
       return {
           ...topicDatum
       }
   })
}