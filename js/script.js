'use strict';

// Source for loading data into Papa parse: https://www.joyofdata.de/blog/parsing-local-csv-file-with-javascript-papa-parse/
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

        // CREATING LISTS
        function has(item, list, amount) {
            // LOOPING THROUGH LIST
            for (let i = 0; i < list.length; i++) {
                // CHECK IF ITEM IS IN LIST
                if (item === list[i][0]) {
                    // NOT ADDING THE ITEM TO THE LIST BUT ADDING THE VALUE TO THE AMOUNT TO SUM THEM UP
                    list[i][1] += amount;
                    return true;
                } 
            }
            return false;
        }

        // VARIBALES
        // TOTAL DONAITON
        let totalAmount = 0;
        // TOTOAL OF INDIVIDUAL AGGREGATED CONTRIBUTIONS
        let totalAggDonors = 0;
        // TOTAL OF DONATIONS OVER $50
        let totalDonors = 0;
        // COUNT OF DONORS (REMOVES DUPLICATES) - DOESN'T ACCOUNT FOR ADDING INITIALS, MISSPELLINGS, ETC
        let uniqueDonors = 0;
        // 2D ARRAY OF DONORS AND THE AMOUNT THEY DONATED
        let donorsArr = [];
        // UNDEFINED OR NULL VALUES IN THE NAME COLUMN
        let donorsError = 0;
        // FOR THE AVERAGE CALCULATION
        let sum = 0;
        // COUNT OF UNDEFINED VALUES IN THE NAME COLUMN
        let undefinedCount = 0;
        // ARRAY TO FIND ABSOLUTE MINIMUM DONATION WITH AGGREGATED INDIVIDUAL CONTRIBUTIONS
        let amountVal = [];
        // ARRAY TO FIND THE MINIMUM DONATION AMONG NAMED DONORS
        let amountVal2 = [];
        // COUNT OF NAMED DONORS WHO GAVE LESS THAN $50 THIS REPORT
        let lessCount = 0;
        // DONATION AMOUNTS AMONG NAMED DONORS, USED TO FIND MAX
        let findMax = []; 
        // LIST OF DONORS WHO GAVE THE MAXIMUM DONATION AMOUNT
        let highestDonors = [];
        // 2D ARRAY OF STATES AND DONATION AMOUNT BY STATE
        let byState = [];
        // COUNT OF UNDEFINED STATE VALUES
        let undefinedState = 0;
        // LIST OF STATES FOR THE C3 GRAPH
        let state = [];
        // LIST OF AMOUNTS BY STATES FOR C3 GRAPH
        let stateTotal = ['stateTotal'];

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] !== undefined) {
                // TOTAL AMOUNT
                totalAmount += candidateRcpts[i]['Amount'];
                // FOR THE AVERAGE CALCULATION
                sum += candidateRcpts[i]['Amount'];
                // ARRAY TO FIND ABSOLUTE MINIMUM DONATION WITH AGGREGATED INDIVIDUAL CONTRIBUTIONS
                amountVal[amountVal.length] = candidateRcpts[i]['Amount'];
                // ARRAY TO FIND MAXIMUM DONATION
                findMax[findMax.length] = candidateRcpts[i]['Amount'];
            } else if (candidateRcpts[i]['Amount'] === undefined || candidateRcpts[i]['Amount'] === null) {
                // COUNTING UNDEFINED AMOUNT VALUES
                undefinedCount++;
            }

            if (candidateRcpts[i]['Name'] === "Aggregated Individual Contribution") {
                // TOTAL OF AGGREGATED INDIVIDUAL CONTRIBUTORS & NON INDIVIDUAL CONTRIBUTORS
                totalAggDonors++;
            } else if (candidateRcpts[i]['Name'] === undefined || candidateRcpts[i]['Name'] === undefined) {
                // COUNTING UNDEFINED OR NULL VALUES IN THE NAME COLUMN
                donorsError++;
            } else {
                if (candidateRcpts[i]['Amount'] >= 50) {
                    // TOTAL OF DONATIONS $50 AND UP
                    totalDonors++;
                    // ARRAY TO FIND THE MINIMUM DONATION AMONG NAMED DONORS
                    amountVal2[amountVal2.length] = candidateRcpts[i]['Amount'];
                } else {
                    // COUNT OF NAMED DONORS WHO GAVE LESS THAN $50 THIS REPORT
                    lessCount++;
                }
                // TO FIND IF NAMES EXISTS WITHIN AN ARRAY
                if (!has(candidateRcpts[i]['Name'], donorsArr, candidateRcpts[i]['Amount'])) {
                    // ADDING A NAME IF DOESN'T ALREADY EXIST IN THE DONORS ARRAY
                    donorsArr.push([candidateRcpts[i]['Name'], candidateRcpts[i]['Amount']]);
                    // INCREASE COUNT OF UNIQUE DONORS
                    uniqueDonors++;
                }

                
            }
        }

        // FIND THE MAX OF THE FINDMAX LIST
        let max = Math.max.apply(null, findMax);

        // FIND THE NAME(S) OF THOSE WHO GAVE THE MAX AMOUNT
        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Amount'] === max) {
                highestDonors[highestDonors.length] = candidateRcpts[i]['Name'];
            }
        }

        // FRONT END PUBLISHING TO PAGE

        // TOTAL AMOUNT
        document.getElementById("total").innerHTML = " $" + parseFloat(totalAmount).toFixed(2);

        // APPENDING DONORS ARRAY AND THE AMOUNT DONATED TO THE TABLE
        for (let i = 0; i < donorsArr.length; i++) {
            // console.log(donorsArr[i][0]);
            // console.log(donorsArr[i][1]);
            $('#donorsList').append('<tr><td>' + donorsArr[i][0] + '</td><td>' + '$' + parseFloat(donorsArr[i][1]).toFixed(2) + '</td></tr>');
        }

        // TOTAL COUNT OF AGGREGATED INDIVIDUAL CONTRIBUTIONS
        document.getElementById('individuals').innerHTML = totalAggDonors;

        // TOTAL COUNT OF NON-AGGREGATED INDIVIDUAL CONTRIBUTIONS DONATIONS
        document.getElementById('donations').innerHTML = totalDonors;

        // TOTAL COUNT OF UNIQUE DONORS
        document.getElementById('donors').innerHTML = uniqueDonors;

        // IF THERE ARE UNDEFINED OR NULL VALUES IN THE NAME COLUMN, AN ERROR PUBLISHES
        if (donorsError > 0) {
            if (donorsError === 1) {
                document.getElementById('uniqueDonorsError').innerHTML = "There was " + donorsError + " undefined or null value in this list. It is not included below."; 
            } else {
                document.getElementById('uniqueDonorsError').innerHTML = "There were " + donorsError + " undefined or null values in this list. They are not included below."; 
            }
            
        }

        // IF THERE ARE UNDEFINED OR NULL VALEUS IN THE AMOUNT COLUMN, AN ERROR PUBLISHES
        if (undefinedCount > 0) {
    
            if (undefinedCount === 1) {
                document.getElementById('undefinedCount').innerHTML = "There was " + undefinedCount + " undefined or null value. This value was not factored into the average.";
                console.log("There was " + undefinedCount + " undefined or null value. This value was not factored into the average.");
            } else {
                document.getElementById('undefinedCount').innerHTML = "There were " + undefinedCount + " undefined or null values. These values were not factored into the average.";
                console.log("There were " + undefinedCount + " undefined or null values. These values were not factored into the average.");
            }
        }

        // AVERAGE
        let divisor = candidateRcpts.length - undefinedCount;
        document.getElementById('average').innerHTML = "$" + parseFloat(sum / divisor).toFixed(2);
        
        // MINIMUM AGGREGATED INDIVUDAL CONTRIBUTION
        let absoluteMin = Math.min.apply(null, amountVal);
        document.getElementById('minimumAgg').innerHTML = "$" + absoluteMin;

        // MINIMUM NON-AGGREGATED INDIVUDAL CONTRIBUTION DONATION
        let min = Math.min.apply(null, amountVal2);
        document.getElementById('minimumDonor').innerHTML = "$" + min;

        // COUNT IF THERE IS A NAMED DONOR WHO GAVE LESS THAN $50 THIS REPORT
        if (lessCount > 0) {
            if (lessCount === 1) {
                document.getElementById('error').innerHTML = "Seems like an amount less than $50 and NOT labeled an Aggregated Individual Contribution was caught in this data set. It is possible a donor gave more previously and donated less during this report. If so, their name should be listed below.";

                console.log("Seems like an amount less than $50 and NOT labeled an Aggregated Individual Contribution was caught in this data set.");
            } else {
                document.getElementById('error').innerHTML = "Seems like several amounts less than $50 and NOT labeled Aggregated Individual Contributions were caught in this data set. It is possible several donors gave more previously and donated less during this report. If so, their name should be listed below.";
                console.log("Seems like several amounts less than $50 and NOT Aggregated Individual Contributors were caught in this data set.");
            }
        }
        
        // MAXIMUM DONATION
        document.getElementById('maximum').innerHTML = "$" + max;

        // APPENDING LIST OF DONORS WHO GAVE THE MAX
        if (highestDonors.length === 1) {
            document.getElementById('maxDonor').innerHTML = "The highest donor is: " + highestDonors.join(', ') + ".";
        } else {
            document.getElementById('maxDonor').innerHTML = "The donors who gave the max amount are: " + highestDonors.join(', ') + ".";
        }


        // GENERATING LIST OF AMOUNT OF DONATIONS PER STATE
        for (let i = 0; i < candidateRcpts.length; i++) {
            // FILTERING OUT UNDEFINED STATE VALUES - WILL CAUSE ERRORS
            if (candidateRcpts[i]['State'] === undefined) {
                undefinedState++;
            } else if (candidateRcpts[i]['Name'] !== "Aggregated Individual contribution") {
                if (has(candidateRcpts[i]['State'], byState, candidateRcpts[i]['Amount'])) {
                    // IF STATE IS ALREADY ON THE LIST, ADD THIS AMOUNT TO THE STATE AMOUNT IN THE ARRAY

                } else  {
                    // STATE IS NOT ON THE LIST, THEN ADD IT
                    byState.push([candidateRcpts[i]['State'], candidateRcpts[i]['Amount']]);
                }
            } 
        }

        // LOOPING THROUGH BYSTATE 2D ARRAY
        for (let i = 0; i < byState.length; i++) {
            // ADDING STATES TO ONE ARRAY
            state.push(byState[i][0]);
            // ADDING STATE DONATION AMOUNTS TO ARRAY
            stateTotal.push(byState[i][1]);
        }

        // C3 CHART FOR DONATIONS BY STATE
        var chart = c3.generate({
            bindto: '#chart',
            title: {
                show: true,
                text: 'Donation Amount By State'
            },
            data: {
                columns: [
                    stateTotal
                ],
                type: 'bar',

            },
            color: {
                pattern: ['#8C1C1C']
            },
            axis: {
                x: {
                    type: 'category',
                    categories: state,
                    label: 'State'
                },
                y: {
                    label: 'Amount ($)',
                    tick: {
                        format: d3.format("$")
                    }
                }
            }
        });

        // MY LOGS

        // console.log("The total amount the candidate received in this report is $" + totalAmount + ".");
        // console.log(uniqueDonors);
        // console.log(donorsArr);
        // console.log(donorsArr[1]);
        // console.log(donorsArr[1][0] + ", " + donorsArr[1][1]);
        // console.log(donorsArr.length);
         // console.log("The total number of Aggregated Individual Contributors who gave less than $50 is " + totalAggDonors + ". And the total number of donors who gave over $50 is " + totalDonors + ".");
        //  console.log("The average of this candidates donations was: $" + parseFloat(sum / divisor).toFixed(2) + " (Rounded to 2 decimals)");
        // console.log(amountVal2);
        // console.log("The lowest amount donated including the Aggregated Individual Contributors is $" + Math.min.apply(null, amountVal) + ".");
        // console.log("The lowest amount donated NOT including the Aggregated Individual Contributors is $" + Math.min.apply(null, amountVal2) + ".");
        // console.log("The maximum donation is $" + max + ".");
        // console.log("The donor(s) that gave the max amount is/are " + highestDonors.join(', '));
        // console.log(byState);
        // console.log(byState[0][0]);
        // console.log(byState[0][1]);
        // console.log(state);
        // console.log(stateTotal);
        
    }
  });
}

$(document).ready(function(){
    $("#csv-file").change(handleFileSelect);
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    
});
