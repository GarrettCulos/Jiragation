# Jiragation

This application consolidates you JIRA tasks, across several different accounts, into one easy to manage time tracking system.

## Prerequisites

We use a number of node.js tools to initialize. You must have node.js and
its package manager (npm) installed.  You can get them from [http://nodejs.org/](http://nodejs.org/).


## Steps to Installation

To get you started you can simply clone the repository and install the dependencies:

# Clone Repository

```
git clone https://github.com/garrettH3S/Jiragation.git <repository_name>
```

# Install Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help
us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
npm install
bower install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

# Configuring 

Before running the application make sure the following is set up:

- There is a database and its settings are set in ```config/local.json```
- You have created a secret and chosen a port (something over 9000 is suggested)

## Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:<chosen port>`.

# Updating Angular

Previously we recommended that you merge in changes to into your own fork of the project.
Now that the angular framework library code and tools are acquired through package managers (npm and
bower) you can use these tools instead to update the dependencies.

You can update the tool dependencies by running:

```
npm update
```

This will find the latest versions that match the version ranges specified in the `package.json` file.

You can update the Angular dependencies by running:

```
bower update
```

This will find the latest versions that match the version ranges specified in the `bower.json` file.


# Contact
For more information about this application contact garrett@highwaythreesoutions.com

For more information on AngularJS please check out http://angularjs.org/

[git]: http://git-scm.com/
[bower]: http://bower.io
[npm]: https://www.npmjs.org/
[node]: http://nodejs.org
[protractor]: https://github.com/angular/protractor
[travis]: https://travis-ci.org/
[http-server]: https://github.com/nodeapps/http-server


## Known Issues and Task Log
- extend authorization token after performing verified http request.
- multi-day log, left date, styling issue.
- adding comments work intermittently.
- hash account passwords for db storage.