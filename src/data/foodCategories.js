export const categories = [
  { id: 'dairy', name: 'Dairy', emoji: '🥛', color: 'bg-blue-100' },
  { id: 'vegetables', name: 'Vegetables', emoji: '🥬', color: 'bg-green-100' },
  { id: 'fruits', name: 'Fruits', emoji: '🍎', color: 'bg-red-100' },
  { id: 'meat', name: 'Meat', emoji: '🥩', color: 'bg-orange-100' },
  { id: 'grains', name: 'Grains', emoji: '🍞', color: 'bg-yellow-100' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤', color: 'bg-purple-100' },
  { id: 'snacks', name: 'Snacks', emoji: '🍪', color: 'bg-pink-100' },
  { id: 'other', name: 'Other', emoji: '📦', color: 'bg-gray-100' },
];

export const getCategoryById = (id) => categories.find(c => c.id === id) || categories[7];