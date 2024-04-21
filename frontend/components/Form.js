import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';  // Import Yup for validation

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'Full name must be at least 3 characters',
  fullNameTooLong: 'Full name must be at most 20 characters',
  sizeIncorrect: 'Size must be S, M, or L',
};

// 👇 Here you will create your schema. (use Yup)
const formSchema = Yup.object({
  fullName: Yup.string()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required('Full name is required'),
    size: Yup.string()
    .oneOf(['S', 'M', 'L'], 'size must be S or M or L')  
    .required('Size is required'),
  
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() { // Form component
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    selectedToppings: []
  });
  const [errors, setErrors] = useState({}); // Track form validation errors
  const [touchedFields, setTouchedFields] = useState({}); // Track which fields were touched
  const [submissionMessage, setSubmissionMessage] = useState(''); // State for submission messages

  useEffect(() => {
    // Validating fullName in real-time, provide feedback while typing
    if (touchedFields.fullName) {
      Yup.reach(formSchema, 'fullName')
        .validate(formData.fullName)
        .then(() => {
          const newErrors = { ...errors };
          delete newErrors.fullName;
          setErrors(newErrors);
        })
        .catch(err => { // Catch validation errors
          setErrors(prevErrors => ({ ...prevErrors, fullName: err.message })); // Set the error message with the error message from Yup
        });
    }
  }, [formData.fullName, touchedFields.fullName]);

  const handleInputChange = (event) => { // this is for input change handler for full name and size inputs
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.trim()  // Trim whitespace from input
    }));
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };
  
  
  
  const handleCheckboxChange = (toppingId) => {
    setFormData(prevData => ({
      ...prevData,
      selectedToppings: prevData.selectedToppings.includes(toppingId) ?
        prevData.selectedToppings.filter(id => id !== toppingId) : [...prevData.selectedToppings, toppingId]
    }));
    setTouchedFields(prev => ({ ...prev, selectedToppings: true }));
  };

  const handleSubmit = (event) => { // Form submission handler
    event.preventDefault();
    formSchema.validate(formData, { abortEarly: false })
      .then(() => {
        const sizeDescription = formData.size === 'S' ? 'small' : 
                                formData.size === 'M' ? 'medium' : 
                                formData.size === 'L' ? 'large' : '';
        const message = formData.selectedToppings.length > 0 ?
          `Thank you for your order, ${formData.fullName}! Your ${sizeDescription} pizza with ${formData.selectedToppings.length} toppings is on the way.` :
          `Thank you for your order, ${formData.fullName}! Your ${sizeDescription} pizza with no toppings is on the way.`;
        setSubmissionMessage(message);  // Set the correct success message

        // Reset form data, touched fields, and errors
        setFormData({
          fullName: '',
          size: '',
          selectedToppings: []
        });
        setTouchedFields({});
        setErrors({});
      })
      .catch((err) => {
        const formattedErrors = err.inner.reduce((acc, error) => {
          acc[error.path] = error.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {submissionMessage && <div className="success-message">{submissionMessage}</div>}
      <div className="input-group">
        <label htmlFor="fullName">Full Name</label><br />
        <input
          name="fullName"
          placeholder="Type full name"
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          aria-describedby="fullNameError"
        />
        {touchedFields.fullName && errors.fullName && (
          <div className='error' id="fullNameError">{errors.fullName}</div>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="size">Size</label><br /> 
        <select
          name="size"
          id="size"
          value={formData.size}
          onChange={handleInputChange}
          aria-describedby="sizeError"
        >
          <option value="">----Choose Size----</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
        {touchedFields.size && errors.size && (
          <div className='error' id="sizeError">{errors.size}</div>

        )}
      </div>

      <div className="input-group">
        {toppings.map(({ topping_id, text }) => (
          <label key={topping_id}>
            <input
              type="checkbox"
              checked={formData.selectedToppings.includes(topping_id)}
              onChange={() => handleCheckboxChange(topping_id)}
            />
            {text}<br />
          </label>
        ))}
      </div>

      <input type="submit" disabled={!formData.fullName || !formData.size || Object.keys(errors).length !== 0} />
    </form>
  );
}