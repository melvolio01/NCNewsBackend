const getHomePage = (req, res, next) => {
    res.send(express.static(__dirname + '/public'));
}

module.exports = {getHomePage};
