import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import axios from 'axios';
import logo from '../../assets/logo/TidyHome_Logo.png'; // Make sure this path is correct

// Fix for "Buffer is not defined" error in browser environment
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
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    paddingBottom: 10
  },
  logo: {
    width: 120,
    height: 50
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#112131'
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 5
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    marginBottom: 10
  },
  table: {
    width: '100%',
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 5,
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderBottomStyle: 'solid'
  },
  col1: {
    width: '30%'
  },
  col2: {
    width: '20%',
    textAlign: 'right'
  },
  col3: {
    width: '25%',
    textAlign: 'right'
  },
  col4: {
    width: '25%',
    textAlign: 'right'
  },
  footer: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 30,
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
    padding: 20
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
  const totalItems = inventoryData.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const categories = [...new Set(inventoryData.map(item => item.categoryId?.name || 'Uncategorized'))];
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
                (item.categoryId?.name || 'Uncategorized') === category
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
                  <Text style={styles.col1}>{item.categoryId?.name || 'Uncategorized'}</Text>
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
                  <Text style={styles.col1}>{item.categoryId?.name || 'Uncategorized'}</Text>
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
          **Generated Automatically by HomeStock Inventory Tracker**
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
      const response = await axios.get('http://localhost:3500/api/inventory/getAllInventories', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Handle both response formats: {success, data} and direct array
      const data = response.data?.data || response.data;
      
      if (Array.isArray(data)) {
        setInventoryData(data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received unexpected data format from server');
        setInventoryData([]);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      setError('Failed to load inventory data. Please try again.');
      setInventoryData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser({ name: 'System' });
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      setUser({ name: 'System' });
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