'use strict';

$(document).ready(function(){
    $("#csv-file").change(handleFileSelect);
});

var data;


 
function handleFileSelect(evt) {
  var file = evt.target.files[0];
  
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    complete: function(results) {
        data = results.data;
        let candidateRcpts = [];
        for (let i = 0; i < data.length; i++) {
            candidateRcpts[candidateRcpts.length] = data[i];
        }

        // Total Amount
        let totalAmount = 0;
        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] !== undefined) {
                totalAmount += candidateRcpts[i]['Amount'];
            }
        }

        console.log("The total amount the candidate received in this report is $" + totalAmount + ".");
        document.getElementById("total").innerHTML= totalAmount;
        
        // Total of Aggregated Individual Contributors & Non Individual Contributors
        let totalAggDonors = 0;
        let totalDonors = 0;

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Name'] === "Aggregated Individual Contribution") {
                totalAggDonors++;
            } else {
                totalDonors++;
            }
        }

        console.log("The total number of Aggregated Individual Contributors who gave less than $50 is " + totalAggDonors + ". And the total number of donors who gave over $50 is " + totalDonors + ".");


        // AVERAGE
        let sum = 0;
        let undefinedCount = 0;
        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] !== undefined) {
                sum += candidateRcpts[i]['Amount'];
                // console.log(candidateRcpts[i]['Amount']);
            } else if (candidateRcpts[i]['Amount'] === undefined || candidateRcpts[i]['Amount'] === null) {
                undefinedCount++;
            }
            
        }
        let divisor = candidateRcpts.length - undefinedCount;
        console.log("The average of this candidates donations was: $" + parseFloat(sum / divisor).toFixed(2) + " (Rounded to 2 decimals)");
        if (undefinedCount === 0) {
            console.log("There were no undefined or null valeus.");
        } else if (undefinedCount === 1) {
            console.log("There was " + undefinedCount + " undefined or null value. This value was not factored into the average.");
        } else {
            console.log("There were " + undefinedCount + " undefined or null values. These values were not factored into the average.");
        }

        // Minimum
        let amountVal = [];
        let amountVal2 = [];
        let lessCount = 0;
        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] !== undefined) {
                amountVal[amountVal.length] = candidateRcpts[i]['Amount'];

                if (candidateRcpts[i]['Name'] !== "Aggregated Individual Contribution") {
                    // console.log(candidateRcpts[i]['Name']);
                    if (candidateRcpts[i]['Amount'] < 50) {
                        lessCount++;
                    } else {
                        amountVal2[amountVal2.length] = candidateRcpts[i]['Amount'];
                    }
                    
                }
            }

            
        }
        console.log(amountVal2);
        console.log("The lowest amount donated including the Aggregated Individual Contributors is $" + Math.min.apply(null, amountVal) + ".");
        console.log("The lowest amount donated NOT including the Aggregated Individual Contributors is $" + Math.min.apply(null, amountVal2) + ".");

        if (lessCount === 0) {
            // Nothing
        } else if (lessCount === 1) {
            console.log("Seems like an amount less than $50 and NOT Aggregated Individual Contributors were caught in this data set.");
        } else {
            console.log("Seems like several amounts less than $50 and NOT Aggregated Individual Contributors were caught in this data set.")
        }
        
        // Maximum
        let findMax = [];
        let highestDonors = [];

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] !== undefined) {
                findMax[findMax.length] = candidateRcpts[i]['Amount'];
            }
            
        }

        let max = Math.max.apply(null, findMax);

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] === max) {
                highestDonors[highestDonors.length] = candidateRcpts[i]['Name'];
            }
            
        }

        console.log("The maximum donation is $" + max + ".");
        console.log("The donor(s) that gave the max amount is/are " + highestDonors);
        
        
    }
  });
}


