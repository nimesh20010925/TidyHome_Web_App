import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Supplier_table from './supplier_table/supplier_table';
import Stores_table from './store_table/store_table';
export default () => (
  <Tabs>
    <TabList>
      <Tab>Suppliers</Tab>
      <Tab>Stores</Tab>
    </TabList>

    <TabPanel>
      <Supplier_table />
    </TabPanel>
    <TabPanel>
        <Stores_table />
    </TabPanel>
  </Tabs>
);