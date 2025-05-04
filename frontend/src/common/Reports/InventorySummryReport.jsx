import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios';
import logo from '../../assets/logo/TidyHome_Logo.png';

// Buffer fix for browser environment
if (typeof window !== 'undefined' && window.Buffer === undefined) {
  window.Buffer = require('buffer').Buffer;
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', margin: '10px' }}>
          Error generating report. Please try again.
          {this.state.errorInfo && (
            <details style={{ marginTop: '10px' }}>
              <summary>Error details</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// PDF Styles
// Updated PDF Styles with smaller fonts
const styles = StyleSheet.create({
    page: {
      padding: 20,  // Reduced from 30
      fontFamily: 'Helvetica'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,  // Reduced from 20
      borderBottomWidth: 1,  // Reduced from 2
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
      paddingBottom: 8  // Reduced from 10
    },
    logo: {
      width: 100,  // Reduced from 120
      height: 40  // Reduced from 50
    },
    title: {
      fontSize: 18,  // Reduced from 24
      textAlign: 'center',
      marginBottom: 15,  // Reduced from 20
      fontWeight: 'bold',
      color: '#112131'
    },
    subtitle: {
      fontSize: 12,  // Reduced from 14
      textAlign: 'center',
      marginBottom: 20  // Reduced from 30
    },
    section: {
      marginBottom: 15  // Reduced from 20
    },
    sectionTitle: {
      fontSize: 14,  // Reduced from 16
      fontWeight: 'bold',
      marginBottom: 8,  // Reduced from 10
      backgroundColor: '#f0f0f0',
      padding: 4  // Reduced from 5
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: '#112131',
      borderBottomStyle: 'solid',
      marginBottom: 8  // Reduced from 10
    },
    table: {
      width: '100%',
      marginBottom: 12  // Reduced from 15
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f0f0f0',
      padding: 4,  // Reduced from 5
      fontWeight: 'bold',
      fontSize: 10  // Added smaller font size for table headers
    },
    tableRow: {
      flexDirection: 'row',
      padding: 4,  // Reduced from 5
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
      borderBottomStyle: 'solid',
      fontSize: 10  // Added smaller font size for table rows
    },
    col1: {
      width: '30%',
      fontSize: 10  // Added explicit font size
    },
    col2: {
      width: '20%',
      textAlign: 'right',
      fontSize: 10  // Added explicit font size
    },
    col3: {
      width: '25%',
      textAlign: 'right',
      fontSize: 10  // Added explicit font size
    },
    col4: {
      width: '25%',
      textAlign: 'right',
      fontSize: 10  // Added explicit font size
    },
    footer: {
      fontSize: 8,  // Reduced from 10
      textAlign: 'center',
      marginTop: 20,  // Reduced from 30
      color: '#666666'
    },
    bold: {
      fontWeight: 'bold'
    },
    alert: {
      color: '#e74c3c'
    },
    warning: {
      color: '#f39c12'
    },
    errorText: {
      color: '#e74c3c',
      textAlign: 'center',
      padding: 15,  // Reduced from 20
      fontSize: 12  // Added explicit font size
    }
  });

// PDF Document Component
const InventorySummaryPDF = ({ inventoryData = [], user = {}, loading = false }) => {
  if (loading) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Loading inventory data...</Text>
        </Page>
      </Document>
    );
  }

  if (!Array.isArray(inventoryData)) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.errorText}>Error: Invalid inventory data format</Text>
        </Page>
      </Document>
    );
  }

  // Calculate summary data with proper fallbacks
  const totalItems = inventoryData.length;

  // Updated to use categoryId.name (the populated field from backend)
  const categories = [...new Set(inventoryData.map(item => 
    item.categoryId?.name || item.categoryId?.category_name || 'Uncategorized'
  ))];  // Added the missing closing parenthesis
  
  const lowStockItems = inventoryData.filter(item => (item.quantity || 0) <= (item.lowStockLevel || 0));
  const expiringSoon = inventoryData.filter(item => {
    if (!item.expiryDate) return false;
    try {
      const expiry = new Date(item.expiryDate);
      const today = new Date();
      const diffTime = expiry - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 30 && diffDays >= 0;
    } catch (e) {
      return false;
    }
  });

  // Helper function to get category name safely
  const getCategoryName = (item) => {
    return item.categoryId?.name || item.categoryId?.category_name || 'Uncategorized';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text>HomeStock Tracker</Text>
        </View>
        
        <Text style={styles.title}>Inventory Summary Report</Text>
        <Text style={styles.subtitle}>
          Report Date: {new Date().toISOString().split('T')[0]} | Prepared By: {user?.name || 'System'}
        </Text>

        {/* Inventory Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Overview</Text>
          <View style={styles.divider} />
          <Text>Total Items in Inventory: <Text style={styles.bold}>{totalItems}</Text></Text>
          <Text>Total Categories: <Text style={styles.bold}>{categories.length}</Text></Text>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <View style={styles.divider} />
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Category</Text>
              <Text style={styles.col2}>Total Items</Text>
              <Text style={styles.col3}>Low Stock Items</Text>
            </View>
            {categories.map((category, index) => {
              const categoryItems = inventoryData.filter(item => 
                getCategoryName(item) === category
              );
              const categoryLowStock = categoryItems.filter(item => 
                (item.quantity || 0) <= (item.lowStockLevel || 0)
              );
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{category}</Text>
                  <Text style={styles.col2}>
                    {categoryItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                  </Text>
                  <Text style={styles.col3}>{categoryLowStock.length}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Low Stock Items */}
        {lowStockItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Low Stock Items (Below Threshold)</Text>
            <View style={styles.divider} />
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Item Name</Text>
                <Text style={styles.col1}>Category</Text>
                <Text style={styles.col2}>Current Stock</Text>
                <Text style={styles.col2}>Reorder Qty</Text>
              </View>
              {lowStockItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{item.itemName || 'Unnamed Item'}</Text>
                  <Text style={styles.col1}>{getCategoryName(item)}</Text>
                  <Text style={[styles.col2, styles.alert]}>{item.quantity || 0}</Text>
                  <Text style={styles.col2}>{item.lowStockLevel || 0}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Expiry Alerts */}
        {expiringSoon.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expiry Alerts (Next 30 Days)</Text>
            <View style={styles.divider} />
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.col1}>Item Name</Text>
                <Text style={styles.col1}>Category</Text>
                <Text style={styles.col2}>Expiry Date</Text>
                <Text style={styles.col2}>Current Stock</Text>
              </View>
              {expiringSoon.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.col1}>{item.itemName || 'Unnamed Item'}</Text>
                  <Text style={styles.col1}>{getCategoryName(item)}</Text>
                  <Text style={[styles.col2, styles.warning]}>
                    {item.expiryDate?.split('T')[0] || 'Unknown'}
                  </Text>
                  <Text style={styles.col2}>{item.quantity || 0}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.footer}>
          **Generated Automatically by TidyHome Inventory Tracker**
        </Text>
      </Page>
    </Document>
  );
};

// Main Component
const InventorySummaryReport = ({ isOpen, toggle }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInventoryData();
      fetchUserData();
    }
  }, [isOpen]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
  
      if (!token) throw new Error('Please login to access this feature');
      if (!user?.homeID) throw new Error('No home assigned to user.');
  
      const response = await axios.get(
        `http://localhost:3500/api/inventory/getAllInventories`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { homeId: user.homeID }
        }
      );
  
      setInventoryData(response.data.data);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError(error.message || "Failed to fetch inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) setUser(user);
    } catch (e) {
      console.error("Failed to load user from localStorage");
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginTop: 0 }}>Export Inventory Report</h2>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffeeee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading inventory data...</p>
        ) : (
          <>
            <p>Click the button below to download your comprehensive inventory summary report.</p>
            
            <ErrorBoundary>
              <PDFDownloadLink 
                document={<InventorySummaryPDF 
                  inventoryData={inventoryData} 
                  user={user} 
                  loading={loading} 
                />}
                fileName={`inventory-summary-${new Date().toISOString().split('T')[0]}.pdf`}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  marginTop: '10px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                {({ loading: pdfLoading }) => (
                  pdfLoading ? 'Generating Report...' : 'Download PDF Report'
                )}
              </PDFDownloadLink>
            </ErrorBoundary>

            <button 
              onClick={toggle} 
              style={{
                padding: '10px 15px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InventorySummaryReport;