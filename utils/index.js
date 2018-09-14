exports.formatUserData = (userData) => {
    return userData.map((userDatum) => {
        return {
            ...userDatum
        }
    })
}

exports.addCommentCount = (articles,Comment) => {
    
   return Promise.all(articles.map(article => Comment.count({belongs_to : article._id})))
   .then(counts => {
      return articles.map((article,i) => {
           article.comment_count = counts[i];
           return article;
       })
   })
}   


exports.formatTopicData = (topicData) => {
   return topicData.map((topicDatum) => { 
       return {
           ...topicDatum
       }
   })
}

exports.formatArticleData = (articleData, userDocs, topicDocs) => {
    return articleData.map((articleDatum) => {
        const topic_name = topicDocs.find((topic) => {
            return topic.slug === articleDatum.topic
        })
       
            
        const user_name = userDocs.find((user) => { 
            return user.username === articleDatum.created_by
        })
        const created_by = user_name._id;
        
        return {
            ...articleDatum,
            belongs_to: topic_name.slug,
            created_by
        }
    })
}

exports.formatCommentData = (commentData, articleDocs) => {
    return commentData.map((commentDatum) => {
        const article_info = articleDocs.find((article) => {
            return article.title === commentDatum.belongs_to
        }); 
        return {
            ...commentDatum,
            belongs_to: article_info._id,
            created_by: article_info.created_by
        }
    });
}