function calculateBMI()
{
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const weightUnit = document.getElementById("weight-unit").value;
    const heightUnit = document.getElementById("height-unit").value;
    const result = document.getElementById("bmi-result");

    //validating inputs
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0)
    {
      result.textContent = "Please enter valid values for both weight and height.";
      result.style.color = "#cc0000";
      return;
    }
    
    // Convert weight to kilograms if input is in pounds
    let weightKg = weight;
    if (weightUnit === "lb")
    {
      weightKg = weight * 0.453592;
    }
  
    // Convert height to meters based on selected unit
    let heightM = height;
    if (heightUnit === "cm")
    {
      heightM = height / 100;
    } 
    else if (heightUnit === "ft")
    {
      heightM = height * 0.3048;
    }
  
    // Calculate BMI using the formula: weight (kg) / (height (m))^2
    const bmi = weightKg / (heightM * heightM);
    let category = "";
  
    // Determine BMI category based on BMI value
    if (bmi < 18.5)
    {
      category = "Underweight";
    } 
    else if (bmi < 25)
    {
      category = "Healthy";
    } 
    else if (bmi < 30)
    {
      category = "Overweight";
    } 
    else 
    {
      category = "Obesity";
    }
  
    // Display the BMI result and category
    result.innerHTML = `
      Your BMI is <strong>${bmi.toFixed(1)}</strong> — <span class="category ${category.toLowerCase()}">${category}</span>
    `;
  }
  