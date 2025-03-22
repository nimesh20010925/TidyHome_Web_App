import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Supplier_table from "./supplier_table/supplier_table";
import Stores_table from "./store_table/store_table";
import { useTranslation } from "react-i18next"; // Import translation hook

export default () => {
  const { t } = useTranslation(); // Initialize translation function

  return (
    <Tabs>
      <TabList>
        <Tab>{t("SUPPLIERS")}</Tab>
        <Tab>{t("STORES")}</Tab>
      </TabList>

      <TabPanel>
        <Supplier_table />
      </TabPanel>
      <TabPanel>
        <Stores_table />
      </TabPanel>
    </Tabs>
  );
};
