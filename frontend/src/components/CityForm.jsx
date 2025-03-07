import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

/**
 * CityForm Component
 * Form for creating and editing cities
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Object} props.initialData - Initial city data for editing
 * @param {Function} props.onCancel - Cancel handler
 */
export function CityForm({ onSubmit, initialData, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-2">
        <Label htmlFor="name">City Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter city name"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? "Update" : "Create"} City
        </Button>
      </div>
    </form>
  );
} 