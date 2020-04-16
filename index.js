var inquirer = require("inquirer");
var fs = require('fs');
const axios = require("axios");

inquirer.prompt([
    
  {
    type: "input",
    name: "github_username",
    message: "Enter your GitHub username:"
  },
  {
    type: "input",
    name: "project_title",
    message: "Enter the title of your project:"
  },
  {
    type: "input",
    name: "project_image",
    message: "Enter a project screenshot image link:"
  },
  {
    type: "input",
    name: "description",
    message: "Enter a description of your project:"
  },
  {
    type: "input",
    name: "dependencies",
    message: "List any third-party dependency packages that are needed for installation and their version numbers. Seperate each with a comma:"
  },
  {
    type: "input",
    name: "installation",
    message: "Enter the step-by-step installation instructions:"
  },
  {
    type: "input",
    name: "usage",
    message: "Enter Instructions and examples for use. Include links to screenshots as needed: "
  },
  {
    type: "input",
    name: "collaborators",
    message: "Enter collaborators, if any, with links to their GitHub profiles. Seperate each with a comma:"
  },
  {
    type: "input",
    name: "third_parties",
    message: "Enter third-party assets, if any, that require attribution. Include links to their primary web presence. Seperate each with a comma:"
  },
  {
    type: "input",
    name: "copyright",
    message: "If this project is copyrighted, enter the copyright name here, if none exists, leave blank."
  },
  {
    type: "list",
    message: "Choose a license for the project:",
    name: "license",
    choices: [
      "GNU AGPLv3",
      "GNU GPLv3",
      "GNU LGPLv3",
      "Mozilla Public 2.0",
      "Apache 2.0",
      "MIT",
      "Boost Software 1.0",
      "The Unlicense",
      "None"
    ]
  },
  {
    type: "input",
    name: "guidelines",
    message: "Enter guidelines, if any, on how you would like other developers to contribute to this project:"
  },
  {
    type: "input",
    name: "tests",
    message: "Write test cases for your application here. Include any screenshot links if needed."
  }
  
]).then(function(answers) {
    
    let { github_username, 
            project_title, 
            project_image, 
            description, 
            dependencies, 
            installation, 
            usage,
            collaborators, 
            third_parties,
            copyright, 
            license,
            guidelines,
            tests
         } = answers;

    //git hub username:
    console.log(github_username);
    console.log(project_title);
    console.log(project_image);
    console.log(description);
    console.log(dependencies);
    console.log(installation);
    console.log(usage);
    console.log(collaborators);
    console.log(third_parties);
    console.log(copyright);
    console.log(guidelines);
    console.log(tests);

    if (license !== "None") {
        license = license.split(" ").join("%20");
        license.trim();
        //license badge:
        const licenseBadge = createBadge("license", license);
        console.log("license badge: " + licenseBadge);
    }

    //dependency badges:
    if (dependencies !== "") {

        dependencies = dependencies.split(",");

        let dependencyBadgesArray = [];

        for (let i = 0; i < dependencies.length; i++) {
            let dependency = dependencies[i].trim();
            dependency = dependency.trimLeft();
            const seperator = dependency.indexOf(" ");
            const type = dependency.substr(0, seperator);
            const version = dependency.substr(seperator + 1);
            let dependencyBadge = createBadge(type, version);
            dependencyBadge = dependencyBadge.replace(/" "/g, "");
            dependencyBadgesArray.push(dependencyBadge);
        }

        console.log("Dependency badges: " + dependencyBadgesArray);

    }

    if (github_username !== "") {

        const github_query = `https://api.github.com/users/${github_username}/events/public`;

        axios.get(github_query).then(function(github_userdata) {

        //user email address:
        const gitHubEmail = getEmailAddress(github_userdata);
        console.log(`User's Email address: ${gitHubEmail}`);

        //user profile image:
        const gitHubProfileImage = getProfileImage(github_userdata);
        console.log(`User's Profile Image: ${gitHubProfileImage}`);

        });

    }

});

function createBadge(type, title) {
    return `https://img.shields.io/badge/${type}-${title}-blue`;
}

function getEmailAddress(github_userdata) {

    for (let i = 0; i < github_userdata.data.length; i++) {

        if (github_userdata.data[i].payload.hasOwnProperty("commits")) {
            available = true;
            const gitHubEmail = github_userdata.data[i].payload.commits[0].author.email;
            return gitHubEmail;
        }

    }

    return "User profile email is unavailable";


}

function getProfileImage(github_userdata) {

    for (let i = 0; i < github_userdata.data.length; i++) {

        if (github_userdata.data[i].actor.hasOwnProperty("avatar_url")) { 
            const gitHubProfileImage = github_userdata.data[i].actor.avatar_url;
            return gitHubProfileImage;
        }

    }

    return "User profile image unavailable";

}
