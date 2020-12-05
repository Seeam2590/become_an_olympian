# Become an Olympian
## CS 171 - Visualization, Fall 2020
### Final Project of Team Under the SEA 
Members: Annabelle Paterson, Emma Freeman, Seeam Noor

### About
Our project allows you to explore factors that you can change to maximize your chances on being an Olympian. Through elegant interactive visualizations created using the JavaScript D3 library, you will be able to explore questions like: Being in which country can maximize your chances of being an Olympiad athlete/medalist? What sports should you play based on your sex, height, & weight? Which age are you mostly likely to peak at in your Olympic career? And finally, if you don't meet these standards, is it game over?

### How to view project
- Visit the project live at: https://seeam2590.github.io/become_an_olympian/
- Watch project screencast video: https://www.youtube.com/watch?v=lys76lzxTfE 

### How to run locally
1. Clone the repository on your computer
2. Run the index.html file on any JavaScript IDE. We used [Webstorm](https://www.jetbrains.com/webstorm/).

### Repository Structure
Descriptions of the folders and files in the repository are below:
1. assets: This folder contains the images we used in different parts of our website.
2. css: This folder contains the css code required to style our website using a base Bootstrap template.
3. data: This folder contains the process data files that we used for our project. More information on the data sources can be found on the project website. There is also a jupyter notebook that we used to clean one complicated data set to make it easier to visualize.
4. js: This folder contains the javascript files containing the code to build our interactive website using d3.js. Each file contains the code required for an individual visualization except "main.js", "scripts.js" and "helpers.js". "main.js" is a script which initializes all visualizations built in other script files. "helpers.js" has some functions that adds user interactivity to different drop downs. "scripts.js" is the core scripts required to support the Bootstrap template of our website.
5. facts.txt: We had a few fun facts in the website. This text file contains a few more fun facts in case you are interested.
6. index.html: This is the main file that brings together every part of the project and serves it as a website front-end.
