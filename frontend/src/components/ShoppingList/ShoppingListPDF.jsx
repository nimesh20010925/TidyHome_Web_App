import { useEffect, useState } from "react";
import axios from "axios";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";
import starIcon from "../../assets/shoppingList/star-red.png";
import HomeDummyImg from "../../assets/navBar/dummy-home.jpg";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#976bdb",
    borderBottomStyle: "solid",
    paddingBottom: 40,
    marginTop: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 60,
    height: 50,
    borderRadius: 25,
    marginRight: 14,
    marginBottom: 0,
  },
  homeInfo: {
    flexDirection: "column",
  },
  homeName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 3,
  },
  homeAddress: {
    fontSize: 11,
    color: "#4a5568",
    marginBottom: 2
  },
  logoImage: {
    width: 50,
    height: 50,
    marginBottom: -10,
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  subHeader: {
    marginBottom: 10,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 4,
  },
  subtitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#4a5568",
    fontSize: 11,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    fontWeight: "bold",
    color: "#374151",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    alignItems: "center",
  },
  colName: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 12,
  },
  colQty: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  colCost: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
  },
  star: {
    color: "#f59e0b",
    marginRight: 4,
    fontSize: 12,
  },
  priceText: {
    fontSize: 10,
    color: "#6b7280",
  },
  boldText: {
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  totalSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#374151",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  urgentTotal: {
    color: "#dc2626",
  },
  saveBox: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#ecfdf5",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    borderRadius: 4,
  },
  saveText: {
    color: "#065f46",
    fontSize: 12,
  },
});

const ShoppingListPDF = ({ selectedShoppingList }) => {
  const [home, setHome] = useState(null);
  const [error, setError] = useState(null);
  const items = selectedShoppingList.itemList || [];

  useEffect(() => {
    fetchHome();
  }, []);

  // Fetch home owned by the relevant owner (authenticated user)
  const fetchHome = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      if (!token) {
        setError("No token found, please login.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3500/api/home/myhomes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHome(response.data.homes[0]); // Assuming the user has only one home
      } else {
        setError("No home found for this user");
      }
    } catch {
      setError("Error fetching home");
    }
  };

  const totalCost = items.reduce(
    (sum, i) => sum + (i.estimatedItemCost || 0),
    0
  );

  const urgentCost = items
    .filter((i) => i.isUrgent)
    .reduce((sum, i) => sum + (i.estimatedItemCost || 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image style={styles.profileImage} src={HomeDummyImg} />
            <View style={styles.homeInfo}>
              <Text style={styles.homeName}>
                {home?.homeName || "Home Name"}
              </Text>
              <Text style={styles.homeAddress}>
                {home?.homePhone || "Home Contact Number"}
              </Text>
              <Text style={styles.homeAddress}>
                {home?.address || "Home Address"}
              </Text>
            </View>
          </View>
          {/* <Image style={styles.logoImage} src={selectedShoppingList.logo} /> */}
        </View>

        {/* Sub Header */}
        <View style={styles.subHeader}>
          <Text style={styles.title}>
            {selectedShoppingList.listName || "Shopping List"}
          </Text>
          <View style={styles.subtitle}>
            <Text>
              Shopping Date:{" "}
              {new Date(selectedShoppingList.shoppingDate).toLocaleDateString()}
            </Text>
            <Text>No. of Items: {items.length}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colName]}>Item Name</Text>
          <Text style={[styles.colQty]}>Quantity</Text>
          <Text style={[styles.colCost]}>Est. Cost (LKR)</Text>
        </View>

        {/* Items */}
        {items.map((item, index) => (
          <View style={styles.row} key={index}>
            <View style={styles.colName}>
              {item.isUrgent && (
                <Image style={styles.starIcon} src={starIcon} />
              )}
              <View>
                <Text style={styles.boldText}>{item.itemName}</Text>
                <Text style={styles.priceText}>
                  {Number(item.price).toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}{" "}
                  LKR
                </Text>
              </View>
            </View>
            <Text style={styles.colQty}>
              {["Kg", "Litre", "Mitre"].includes(item?.itemType)
                ? Number(item.quantity).toFixed(1)
                : item.quantity}{" "}
              {item.itemType !== "Unit" && item.itemType}
            </Text>
            <Text style={styles.colCost}>
              {Number(item.estimatedItemCost).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Estimated Total Shopping Cost:
            </Text>
            <Text style={styles.totalValue}>
              {totalCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              LKR
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, styles.urgentTotal]}>
              Estimated Urgent Items Cost:
            </Text>
            <Text style={[styles.totalValue, styles.urgentTotal]}>
              {urgentCost.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              LKR
            </Text>
          </View>
        </View>

        {/* Savings Box */}
        {totalCost > urgentCost && (
          <View style={styles.saveBox}>
            <Text style={styles.saveText}>
              You can save{" "}
              <Text style={{ fontWeight: "bold" }}>
                {(totalCost - urgentCost).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                LKR
              </Text>{" "}
              by purchasing only urgent items.
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

ShoppingListPDF.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedShoppingList: PropTypes.any.isRequired,
};

export default ShoppingListPDF;
