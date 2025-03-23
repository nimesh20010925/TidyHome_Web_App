import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Supplier_table from "./supplier_table/supplier_table";

import { useTranslation } from "react-i18next"; // Import translation hook

export default () => {
  const { t } = useTranslation(); // Initialize translation function

  return (
    <Tabs>
      <TabList>
    
    
      </TabList>

      <TabPanel>
        <Supplier_table />
      </TabPanel>
      
    </Tabs>
  );
};
