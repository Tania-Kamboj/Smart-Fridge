import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredItems, setFilter, selectExpiringItems } from './features/inventory/inventorySlice';
import { openModal, setActiveTab, closeModal, showNotification } from './features/ui/uiSlice';
import { addExpiringItemsToShoppingList } from './features/shoppingList/shoppingListSlice';
import { useGetRandomRecipesQuery, useSearchRecipesQuery } from './features/recipes/recipesAPI';
import FridgeItem from './components/FridgeItem';
import AddItemModal from './components/AddItemModal';
import RecipeCard from './components/RecipeCard';
import ShoppingListItem from './components/ShoppingListItem';
import Stats from './components/Stats';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const items = useSelector(selectFilteredItems);
  const shoppingList = useSelector(state => state.shoppingList);
  const activeTab = useSelector(state => state.ui.activeTab);
  const isModalOpen = useSelector(state => state.ui.isModalOpen);
  const notification = useSelector(state => state.ui.notification);
  const currentFilter = useSelector(state => state.inventory.filter);
  const expiringItems = useSelector(selectExpiringItems);
  
  useEffect(() => {
    if (expiringItems.length > 0) {
      dispatch(addExpiringItemsToShoppingList(expiringItems));
    }
  }, [expiringItems, dispatch]);
  
  const ingredientNames = items.map(item => item.name.toLowerCase());
  const { data: randomRecipes, isLoading: randomLoading } = useGetRandomRecipesQuery();
  const { data: ingredientRecipes, isLoading: ingredientLoading } = useSearchRecipesQuery(
    ingredientNames.length > 0 ? ingredientNames : ['chicken']
  );

  const allRecipes = [...(randomRecipes || []), ...(ingredientRecipes || [])].slice(0, 6);
  const isLoading = randomLoading || ingredientLoading;

  const tabs = [
    { id: 'inventory', label: 'My Fridge', icon: '🧊' },
    { id: 'recipes', label: 'Recipes', icon: '👨‍🍳' },
    { id: 'shopping', label: 'Shopping List', icon: '🛒' },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'fresh', label: 'Fresh' },
    { id: 'expiring', label: 'Expiring' },
    { id: 'expired', label: 'Expired' },
  ];

  const autoAddedCount = shoppingList.filter(item => item.autoAdded).length;

  return (
    <div className="app-container">
      <div className="animated-background">
        <div className="floating-shape shape-1">🥖</div>
        <div className="floating-shape shape-2">🥐</div>
        <div className="floating-shape shape-3">🥛</div>
        <div className="floating-shape shape-4">🥕</div>
        <div className="floating-shape shape-5">🍞</div>
        <div className="floating-shape shape-6">🥒</div>
        <div className="floating-shape shape-7">🧀</div>
        <div className="floating-shape shape-8"></div>
      </div>

      {notification && (
        <div className={`notification-toast notification-${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '️' : '❌'}
          </span>
          {notification.message}
        </div>
      )}

      {isModalOpen && <AddItemModal />}

      <div className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1 className="app-title">
              <span className="title-icon"></span>
              Smart Fridge
            </h1>
            <p className="app-subtitle">Track, Manage & Cook with Intelligence</p>
          </div>
        </header>

        <Stats />

        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveTab(tab.id))}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {tab.id === 'shopping' && autoAddedCount > 0 && (
                <span className="tab-badge">{autoAddedCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="content-card">
          {activeTab === 'inventory' && (
            <div className="inventory-section">
              <div className="section-header">
                <div className="filter-buttons">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => dispatch(setFilter(filter.id))}
                      className={`filter-btn ${currentFilter === filter.id ? 'active' : ''}`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => dispatch(openModal())}
                  className="add-item-btn"
                >
                  <span className="btn-icon">+</span>
                  Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🧊</div>
                  <h3>Your fridge is empty!</h3>
                  <p>Add some items to get started</p>
                  <button
                    onClick={() => dispatch(openModal())}
                    className="primary-btn"
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="items-grid">
                  {items.map(item => (
                    <FridgeItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="recipes-section">
              <div className="section-title">
                <span className="title-emoji">‍🍳</span>
                <h2>Suggested Recipes</h2>
                <p className="section-desc">Based on your ingredients</p>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner">🍳</div>
                  <p>Finding delicious recipes...</p>
                </div>
              ) : allRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {allRecipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🍳</div>
                  <h3>No recipes found</h3>
                  <p>Try adding more ingredients to your fridge!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shopping' && (
            <div className="shopping-section">
              <div className="section-header">
                <h2 className="section-title-text">
                  <span>🛒</span>
                  Shopping List
                  {autoAddedCount > 0 && (
                    <span className="auto-added-badge">
                      {autoAddedCount} auto-added
                    </span>
                  )}
                </h2>
                <div className="shopping-actions">
                  {autoAddedCount > 0 && (
                    <button
                      onClick={() => dispatch({ type: 'shoppingList/clearAutoAdded' })}
                      className="clear-auto-btn"
                    >
                      Clear Auto-Added
                    </button>
                  )}
                  {shoppingList.some(item => item.checked) && (
                    <button
                      onClick={() => dispatch({ type: 'shoppingList/clearChecked' })}
                      className="clear-btn"
                    >
                      Clear Completed
                    </button>
                  )}
                </div>
              </div>

              {shoppingList.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"></div>
                  <h3>Your shopping list is empty</h3>
                  <p>Items expiring soon will be automatically added here</p>
                </div>
              ) : (
                <div className="shopping-list">
                  {shoppingList.map(item => (
                    <ShoppingListItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="main-footer">
          <p>Built with <span className="heart">❤️</span> using Redux Toolkit</p>
        </footer>
      </div>
    </div>
  );
}

export default App;