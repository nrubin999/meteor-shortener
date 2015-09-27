if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("links", function () {
    return Links.find();
  });
}