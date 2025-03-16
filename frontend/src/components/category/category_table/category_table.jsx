import React from 'react'

const category_table = () => {
  return (
    <div>
      <table class="table">
  <thead>
    <tr>
      <th scope="col">Category Image</th>
      <th scope="col">Category Type</th>
      <th scope="col">Category Name</th>
      <th scope="col">Category Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="image1.jpg" alt="Image 1" width="50" /></td>
      <td>Electronics</td>
      <td>Laptop</td>
      <td>High-performance laptop for professionals</td>
    </tr>
    <tr>
      <td><img src="image2.jpg" alt="Image 2" width="50" /></td>
      <td>Clothing</td>
      <td>T-Shirt</td>
      <td>Cotton t-shirt with modern design</td>
    </tr>
    <tr>
      <td><img src="image3.jpg" alt="Image 3" width="50" /></td>
      <td>Accessories</td>
      <td>Watch</td>
      <td>Water-resistant digital watch</td>
    </tr>
  </tbody>
</table>
    </div>
  )
}

export default category_table
