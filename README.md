# TODOs:

## tech debt
* get API under my domain

## new features
* ErrorBoundary with error toaster/state

* new route: Category Limit (for maintenance)
  * track historical limits (will be needed once we can pull budget reports from previous months)
  ```json
  {
    "category": "Market",
    "limit": 100,
    "history": [
      { "endPeriod": 1672830746616, "limit":  900, "isActive": true },
      { "endPeriod": 1672820124295, "limit":  750, "isActive": false },
    ]
  }
  ```
    * when selecting a different budget period, iterate through the array to find the matching date. Grab the first date such that endPeriod becomes bigger than period. For example:
    ```json
      [
        { "endPeriod": "Dec 2022", "limit":  900, "isActive": true },
        { "endPeriod": "Feb 2023", "limit":  750, "isActive": true },
        { "endPeriod": "Aug 2023", "limit":  850, "isActive": true },
      ]
    ```
    * In this case, if we want to check the budget for May 2023, we iterate through the array starting at Dec 2023. That's smaller than May 2023, so go to the next. Feb 2023 is still smaller, so go to the next. Aug 2023 is the first one that's bigger, which means its limit value was in effect during May. Take that limit value.
    * Similarly, if we wanted to check on Sep 2023, we iterate through it all and, since the last period was Aug 2023, which is smaller, it means that whatever current limit is the one to consider.
    * Lastly, for present-month budget, always take the current limit and disregard the `history` values.
    * IMPORTANT: this hinges on the fact that each new limit gets Array.pushed into the array, meaning the last element will always be the newest, and the first element will always be the oldest. This means that some amount of sorting logic might be required on the API side when adding said limits... Or maybe not... build the UI first and see how it feels.
  * edit limit value
    * specify the month/year the new limit is to be considered, defaulting to today's month/year.
    * at the API, grab the current (now old) limit and save it to `history` array. `endPeriod` should ALWAYS round it down to the beginning of the specified month, then -1 ms. This will ensure that this now previous limit ended on the last millisecond of the month before the one specified. For example: current limit is 800. Specifying 1000 to start on Jul 2023 means saving 800 with an `endDate` of `new Date(Jul 2023).getMiliseconds() - 1`, meaning Jun 30 23:59:59:999
  * add category
  * remove category (this might entail a new DB column, like `active`)
  * for fun: plot changes over time

* hamburger menu w/ slide in drawer

* edit transaction modal
  * split transaction

* add toaster to vendor editing for operation status (one for adding category and one for editing transactions)

* new route: vendor maintenance
  * search by vendor name
  * edit vendor code, name and category
  * consider adding handling for ?include param in transactions API
    * ?include=vendor includes the whole vendor object

* new route: total spending / total limit
  * lower pri: graph it out timewise


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
