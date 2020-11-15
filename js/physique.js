
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class PhysiqueVis {

    /*
     *  Constructor method
     */
    constructor() {


        this.initVis();
    }



    initVis () {
        let vis = this;




        vis.wrangleData();
    }


    /*
     *  Data wrangling
     */
    wrangleData () {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;




    }
}

