const setupObject = {
    port: process.env.PORT || 5000,
    message: "Magic is running on ",
    startCallback: function() {
        console.log(this.message + this.port)
    }
};

module.exports = setupObject;