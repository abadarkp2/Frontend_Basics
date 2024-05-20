document.getElementById('sipForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    // Get the values from the form inputs
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);
    const lumpsumAmount = parseFloat(document.getElementById('lumpsumAmount').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value) / 100;
    const years = parseInt(document.getElementById('years').value);

    // Calculate future value of lumpsum
    const futureValueLumpsum = lumpsumAmount * Math.pow(1 + annualRate, years);

    // Calculate future value factor for SIP
    const futureValueFactor = (Math.pow(1 + annualRate, years) - 1) / annualRate * (1 + annualRate);

    // Calculate SIP amount needed
    const sipAmount = (goalAmount - futureValueLumpsum) / futureValueFactor;

    // Display the result
    const resultElement = document.getElementById('result');
    resultElement.textContent = `You need to invest ₹${sipAmount.toFixed(2)} per month to reach your goal.`;
});
