# Rectangle Builder

Rectangle builder is a small application that lets you draw, scale and move rectangles across the screen. You can remove a rectangle by clicking on it and then hitting backspace on your keyboard. You can access the menu by hitting the menu button in the top left of the application. That will let you name and save your layouts for future use. You can also delete and restore layouts from that section. 


## Technologies
This project was bootstrapped using create react app (https://create-react-app.dev/). It uses vanilla react to handle the interactivity and JavaScript. We utilize SaSS for the CSS preprocessor.  

## Components
There are two main components that go into the overall application. They are both in App.js, as that serves as the apps main component.

- RectangleBuilder
    - This is the main component that provides all the logic and canvas for the creating of the rectangles and the manipulation of them. It has some props that can be configured on the component that make it easily customizable. Those are:
        - width
            - The desired width of the canvas.
        - height 
            - The desired height of the canvas.
        - boxes 
            - An array of box objects that can be preloaded into the canvas.
        - lineOffset
            - The offset for the lines .
        - anchorSize
            - The size of the anchors.
        - updateBoxes
            - A function that get's called whenever a box is updated within the component.
        - color 
            - Sets the color of boxes.
        - anchorColor
            - Sets the color of the anchor points on the box.


- Sidebar
    - This is the pop out sidebar menu that contains the logic to store, restore and delete layouts from the local storage. It has a few props that are passed to it:
        - setBoxes
            - A function that will pass the box from the sidebar back into the RectangleBuilder component to be restore on the canvas.
        - setShowSidebar
            - A function that shows & hides the sidebar
        - boxes
            - This passes the current layout from RectangleBuilder to the sidebar so it can be saved. 


## Design Choices
The colors that were chosen for the default values of the component were inspired by the branding colors from the https://www.myinnercircle.ai/ website. 


## Future Additions
- Make the rectangles be able to be rotated
- Highlight the currently selected rectangle so users know which object they are manipulating
- Refactor to use Fabric.JS for more built in options


## Running the project

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Deploying the project
This project is deployed using heroku and the create-react-app buildpack. (https://blog.heroku.com/deploying-react-with-zero-configuration)

To deploy you can `git push heroku main` from within the project repo and it will be automatically deployed.

Please contact the repo owner to get access to the heroku account so you are credentialed to be able to push to the heroku repo.


