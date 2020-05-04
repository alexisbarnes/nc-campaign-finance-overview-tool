'use strict';


var data;

 // Source for loading data into Papa parse: https://www.joyofdata.de/blog/parsing-local-csv-file-with-javascript-papa-parse/

 // I handled the rest of the algorithms to find the average, max, min, etc and publish to page
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
        document.getElementById("total").innerHTML = " $" + totalAmount;

        // Total of Aggregated Individual Contributors & Non Individual Contributors
        let totalAggDonors = 0;
        let totalDonors = 0;
        let uniqueDonors = 0;
        let donorsArr = [];
        let donorsError = 0;

        function has(item, list) {
            for (let i = 0; i < list.length; i++) {
                if (item === list[i][0]) {
                    return true;
                } 
            }
            return false;
        }

        // console.log(has("Alexis", donorsArr));

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Name'] === "Aggregated Individual Contribution") {
                totalAggDonors++;
            } else if (candidateRcpts[i]['Name'] === undefined || candidateRcpts[i]['Name'] === undefined) {
                donorsError++;
            } else {
                if (candidateRcpts[i]['Amount'] > 50) {
                    totalDonors++;
                }
                
                if (!has(candidateRcpts[i]['Name'], donorsArr)) {
                    donorsArr.push([candidateRcpts[i]['Name'], candidateRcpts[i]['Amount']])
                    uniqueDonors++;
                }
                
            }
        }
        // console.log(uniqueDonors);
        console.log(donorsArr);
        // console.log(donorsArr[1]);
        // console.log(donorsArr[1][0] + ", " + donorsArr[1][1]);
        // console.log(donorsArr.length);
        for (let i = 0; i < donorsArr.length; i++) {
            // console.log(donorsArr[i][0]);
            // console.log(donorsArr[i][1]);
            $('#donorsList').append('<tr><td>' + donorsArr[i][0] + '</td><td>' + '$' + donorsArr[i][1] + '</td></tr>');
        }



        console.log("The total number of Aggregated Individual Contributors who gave less than $50 is " + totalAggDonors + ". And the total number of donors who gave over $50 is " + totalDonors + ".");
        document.getElementById('individuals').innerHTML = totalAggDonors;
        document.getElementById('donations').innerHTML = totalDonors;
        document.getElementById('donors').innerHTML = uniqueDonors;
        if (donorsError > 0) {
            if (donorsError === 1) {
                document.getElementById('uniqueDonorsError').innerHTML = "There was " + donorsError + " undefined or null value in this list. It is not included below."; 
            } else {
                document.getElementById('uniqueDonorsError').innerHTML = "There were " + donorsError + " undefined or null values in this list. They are not included below."; 
            }
            
        }

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
        document.getElementById('average').innerHTML = "$" + parseFloat(sum / divisor).toFixed(2);

        if (undefinedCount > 0) {
    
            if (undefinedCount === 1) {
                document.getElementById('undefinedCount').innerHTML = "There was " + undefinedCount + " undefined or null value. This value was not factored into the average.";
                console.log("There was " + undefinedCount + " undefined or null value. This value was not factored into the average.");
            } else {
                document.getElementById('undefinedCount').innerHTML = "There were " + undefinedCount + " undefined or null values. These values were not factored into the average.";
                console.log("There were " + undefinedCount + " undefined or null values. These values were not factored into the average.");
            }
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

        let absoluteMin = Math.min.apply(null, amountVal);

        document.getElementById('minimumAgg').innerHTML = "$" + absoluteMin;

        console.log("The lowest amount donated NOT including the Aggregated Individual Contributors is $" + Math.min.apply(null, amountVal2) + ".");

        let min = Math.min.apply(null, amountVal2);

        document.getElementById('minimumDonor').innerHTML = "$" + min;

        if (lessCount > 0) {
            if (lessCount === 1) {
                document.getElementById('error').innerHTML = "Seems like an amount less than $50 and NOT labeled an Aggregated Individual Contribution was caught in this data set. It is possible a donor gave more previously and donated less during this report. If so, their name should be listed below.";

                console.log("Seems like an amount less than $50 and NOT labeled an Aggregated Individual Contribution was caught in this data set.");
            } else {
                document.getElementById('error').innerHTML = "Seems like several amounts less than $50 and NOT labeled Aggregated Individual Contributions were caught in this data set. It is possible several donors gave more previously and donated less during this report. If so, their name should be listed below.";
                console.log("Seems like several amounts less than $50 and NOT Aggregated Individual Contributors were caught in this data set.");
            }
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
        document.getElementById('maximum').innerHTML = "$" + max;

        if (highestDonors.length === 1) {
            document.getElementById('maxDonor').innerHTML = "The highest donor is: " + highestDonors.join(', ') + ".";
        } else {
            document.getElementById('maxDonor').innerHTML = "The donors who gave the max amount are: " + highestDonors.join(', ') + ".";
        }

        console.log("The donor(s) that gave the max amount is/are " + highestDonors.join(', '));
        // document.getElementById('maxDonor').innerHTML = highestDonors;

        let byState = [];
        let undefinedState = 0;

        function hasState(item, list, amount) {
            for (let i = 0; i < list.length; i++) {
                if (item === list[i][0]) {
                    list[i][1] += amount;
                    return true;
                } 
            }
            return false;
        }

        for (let i = 0; i < candidateRcpts.length; i++) {
            if (candidateRcpts[i]['Name'] === undefined) {
                undefinedState++;
            } else if (candidateRcpts[i]['Name'] !== "Aggregated Individual contribution") {
                if (hasState(candidateRcpts[i]['State'], byState, candidateRcpts[i]['Amount'])) {

                } else  {
                    byState.push([candidateRcpts[i]['State'], candidateRcpts[i]['Amount']]);
                }
            } 
        }

        // console.log(byState);
        // console.log(byState[0][0]);
        // console.log(byState[0][1]);

        let state = [];
        let stateTotal = ['stateTotal'];

        for (let i = 0; i < byState.length; i++) {
            state.push(byState[i][0]);
            stateTotal.push(byState[i][1]);
        }

        console.log(state);
        console.log(stateTotal);

        var chart = c3.generate({
            bindto: '#chart',
            title: {
                show: true,
                text: 'Donation By State'
            },
            data: {
                columns: [
                    stateTotal
                ],
                type: 'bar',

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
