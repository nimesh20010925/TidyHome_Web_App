import React from 'react'
import { useTranslation } from 'react-i18next'; // Import translation hook
import './store_table.css'

const supplier_table = () => {
  const { t } = useTranslation(); // Initialize translation function
  return (
    <div>
      <table class="table">
  <thead>
    <tr>
      <th scope="col" className='ttt'>#</th>
      <th scope="col" className='ttt' >irst</th>
      <th scope="col">ast</th>
      <th scope="col">andle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td className='text-danger'>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
    </div>
  )
}

export default supplier_table
