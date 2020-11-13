
/*
 *  usaViz - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 */

class UsaViz {

    /*
     *  Constructor method
     */
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }


    /*
     *  Initialize station map
     */
    initVis () {
        let vis = this;

        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

    }
}

