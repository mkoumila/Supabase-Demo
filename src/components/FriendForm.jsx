import { useState, useEffect } from 'react';

export function FriendForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: '',
    job: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only pass the editable fields to onSubmit
    const { id, created_at, ...submitData } = formData;
    onSubmit(submitData);
    
    if (!initialData) {
      setFormData({
        name: '',
        age: '',
        address: '',
        job: '',
        email: '',
        phone: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="form-container">
      <h2>{initialData ? 'Edit Friend' : 'Add New Friend'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="text"
          name="job"
          placeholder="Job"
          value={formData.job}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-field"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="input-field"
        />
        <div className="button-group">
          <button type="submit" className={`button ${initialData ? 'button-primary' : 'button-success'}`}>
            {initialData ? 'Update Friend' : 'Add Friend'}
          </button>
          {initialData && (
            <button 
              type="button" 
              className="button button-danger"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 