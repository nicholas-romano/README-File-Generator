var inquirer = require("inquirer");
var fs = require('fs');
const axios = require("axios");

inquirer.prompt([
    /*
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
  */
]).then(function(answers) {
    /*
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
    */
        const github_username = "nicholas-romano";
        const project_title = "Yakto Cat";
        const project_image = "https://octodex.github.com/images/yaktocat.png";
        const description = "Yakto Cat can teach you karate. But don't anger him!";
        const dependencies = "node 16.13.1, axios 7.4.5";
        const installation = "1. warm up with punches and kicks 2. Practice fighting Yaktocat";
        const usage = "Use your training wherever danger strikes";
        const collaborators = "Yaktocat, Jackie Chan";
        const third_parties = "Youtube How-To fight karate videos";
        const copyright = "Yaktocat 2020";
        const license = "Apache 2.0";
        const guidelines = "Proceed with caution";
        const tests = "Kick, punch, block!";

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
    console.log(license);
    console.log(guidelines);
    console.log(tests);

    createFileContent(github_username, project_title, project_image, description, dependencies, installation, usage, collaborators, third_parties, license, guidelines, copyright, tests);

});

function createFileContent(github_username, project_title, project_image, description, dependencies, installation, usage, collaborators, third_parties, license, guidelines, copyright, tests) {

    //README file content goes here:
    let fileContent = "";

    project_title.trim();

    license.trim();
    let licenseBadge = "";
    if (license !== "None") {
        licenseBadge = getLicenseBadge(license);
    }

    dependencies.trim();
    let dependencyBadges = "";
    if (dependencies !== "") {
        dependencyBadges = getDependencyBadges(dependencies);
    }

    if (project_title != "" && license !== "None" && dependencies !== "") {
        fileContent += `# ${project_title} &middot; ${licenseBadge} ${dependencyBadges} \r\r\n`;
    }
    else if (project_title != "" && license !== "None") {
        fileContent += `# ${project_title} &middot; ${licenseBadge} \r\r\n`;
    }
    else if (project_title != "" && dependencies !== "") {
        fileContent += `# ${project_title} &middot; ${dependencyBadges} \r\r\n`;
    }
    else if (project_title !== "") {
        fileContent += `# ${project_title} \r\r\n`;
    }

    project_image.trim();
    if (project_image != "") {
        let projectImage = createProjectImage(project_title, project_image);
        fileContent += `${projectImage} \r\r\n`;
    }

    description.trim();
    if (description != "") {
        fileContent += `## Description \r\n`;
        fileContent += `${description} \r\r\n` ;
    }

    fileContent = setUpTableOfContents(fileContent, installation, usage, collaborators, license, guidelines, tests, github_username);

    if (installation != "") {
        fileContent += `## Installation \r\n`;
        fileContent += `${installation} \r\r\n`;
    }

    if (usage != "") {
        fileContent += `## Usage \r\n`;
        fileContent += `${usage} \r\r\n`;
    }

    if (license != "") {
        fileContent += `## License \r\n`;
        fileContent += `${project_title} is ${license} licensed \r\r\n`;
    }

    if (collaborators != "") {
        fileContent += `## Contributing \r\n`;
        fileContent += `${collaborators} \r\n`;
    }

    if (third_parties != "") {
        fileContent += `${third_parties} \r\n`;
    }

    if (copyright != "") {
        fileContent += `&copy;${copyright} \r\r\n`;
    }

    if (tests != "") {
        fileContent += `## Tests \r\n`;
        fileContent += `${tests} \r\r\n`;
    }

    github_username.trim();
    if (github_username !== "") {
        
        const github_query = `https://api.github.com/users/${github_username}/events/public`;

        axios.get(github_query).then(function(github_userdata) {

        //user email address:
        const gitHubEmail = getEmailAddress(github_userdata);

        //user profile image:
        const gitHubProfileImage = getProfileImage(github_userdata);

        fileContent += `## Questions`;
        fileContent += `${gitHubProfileImage} ${gitHubEmail}`;

        });
    }

    createFile(fileContent);

}

function createFile(fileContent) {

    fs.writeFile("data/README.md", fileContent, function(err) {

    if (err) {
        return console.log(err);
    }    

    console.log("README.md file created.");

  });

}

function createProjectImage(project_title, project_image) {
    return `![${project_title}](${project_image})`;
}

function getLicenseBadge(license) {
    //create license badge:
    license = license.split(" ").join("%20");
    const licenseBadge = createBadge("license", license);
    return licenseBadge;
}

function getDependencyBadges(dependencies) {
    //create dependency badges:
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

    let dependencyBadgesStr = dependencyBadgesArray.toString();
    dependencyBadgesStr = dependencyBadgesStr.split(",").join(" ");

    return dependencyBadgesStr;

}

function createBadge(type, title) {
    return `![${type}](https://img.shields.io/badge/${type}-${title}-blue)`;
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

function setUpTableOfContents(fileContent, installation, usage, collaborators, license, guidelines, tests, github_username) {

    let table_of_contents = [];

    if (installation !== "") {
        table_of_contents.push(`* [Installation](#installation)`);
    }

    if (usage !== "") {
        table_of_contents.push(`* [Usage](#usage)`);
    }

    if (collaborators !== "") {
        table_of_contents.push(`* [Credits](#credits)`);
    }

    if (license !== "") {
        table_of_contents.push(`* [License](#license)`);
    }

    if (guidelines !== "") {
        table_of_contents.push(`* [Contributing](#contributing)`);
    }

    if (tests !== "") {
        table_of_contents.push(`* [Tests](#tests)`);
    }

    if (github_username !== "") {
        table_of_contents.push(`* [Questions](#questions) \r\n`);
    }

    fileContent += `## Table of Contents \r\n`;

    for (let i = 0; i < table_of_contents.length; i++) {
        fileContent += `${table_of_contents[i]} \r\n`;
    }

    return fileContent;

}