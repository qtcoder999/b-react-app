import React, { Component } from "react";
import "./UserForm.css";
// API
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyInfo: {
        domain: "",
        organizationName: "",
        contactName: "",
        addressLine1: "",
        addressLine2: "",
        country: "IN",
        region: "",
        city: "",
        postalCode: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        alternateEmail: "",
        username: "",
        customerPartyAccountName: "",
        customerPartyAccountID: ""
      },
      userDetails: [
        {
          billableID: "",
          phoneNumber: "",
          planID: "",
          cirlce: "",
          firstName: "",
          lastName: "",
          emailID: ""
        }
      ]
    };
  }

  handleSubmit = event => {
    event.preventDefault();
    alert("handleSubmit");
  };

  handleChange = (event, type) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(prevState => {
      return {
        companyInfo: {
          ...prevState.companyInfo,
          [name]: value
        }
      };
    });
  };

  handleAdd = () => {
    const newUserDetails = {
      billableID: "",
      phoneNumber: "",
      planID: "",
      cirlce: "",
      firstName: "",
      lastName: "",
      emailID: ""
    };
    // alert("Call Verification API");
    this.setState(prevState => {
      return {
        userDetails: [{ ...newUserDetails }, ...prevState.userDetails]
      };
    });
  };
  renderDynamicFormFields() {
    return this.state.userDetails.map((item, index) => (
      <div className="customer">
        <input className="billable-id" type="text" />
        <input className="phone-number" type="tel" />
        <input className="plan-id" type="text" />
        <input className="cirlce" type="text" />
        <input className="first-name" type="text" />
        <input className="last-name" type="text" />
        <input className="email-id" type="text" />
        <br />
      </div>
    ));
  }
  static getDerivedStateFromProps(props, state) {
    console.clear();
    console.log(JSON.stringify(state, null, 2));
  }

  render() {
    const { companyInfo } = this.state;
    return (
      <div>
        <div className="headingContainer">
          <header className="heading-box">
            <span className="logo-box">
              <img
                className="logo"
                src="https://assets.cloud.im/prod/ux1/images/logos/gsuite/gsuite-2x.png"
              />
            </span>
            <span className="heading-info-box">
              <h1 className="first-heading">
                Please submit the following details
              </h1>
              <h2 className="second-heading">
                Need support? Call us XXX XXXXXXX
              </h2>
            </span>
          </header>
        </div>
        <div className="container">
          <div className="sub-container">
            <form onSubmit={this.handleSubmit}>
              <label>Customer party account name</label>
              <input
                type="text"
                id="domain"
                name="customerPartyAccountName"
                placeholder="Enter your customer party account name"
                value={companyInfo.customerPartyAccountName}
                onChange={this.handleChange}
              />
              <br />
              <label>Customer party account ID</label>
              <input
                type="text"
                id="customerPartyAccountID"
                name="customerPartyAccountID"
                placeholder="Enter your customer party account ID"
                value={companyInfo.customerPartyAccountID}
                onChange={this.handleChange}
              />
              <br />
              <label>Domain</label>
              <input
                className="halfWidth"
                type="text"
                id="domain"
                name="domain"
                placeholder="Enter your organisation’s domain"
                value={companyInfo.domain}
                onChange={this.handleChange}
              />
              {/* <button
                className="addButton"
                onClick={this.handleAdd}
                value="Add"
              >
                Add
              </button>
              <button onClick={this.handleAdd} value="Add">
                Cancel
              </button> */}
              <br />
              <label>Organization Name</label>
              <input
                type="text"
                id="orgname"
                name="organizationName"
                value={companyInfo.organizationName}
                onChange={this.handleChange}
              />
              <br />
              <div className="separatingMargin">
                <label>Company Address</label>
                <span className="companyAddressBox">
                  <input
                    type="text"
                    id="companyaddr"
                    name="contactName"
                    placeholder="Contact Name"
                    value={companyInfo.contactName}
                    onChange={this.handleChange}
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    placeholder="Street Address Line 1"
                    value={companyInfo.addressLine1}
                    onChange={this.handleChange}
                  />
                  <br />
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    placeholder="Street Address Line 2"
                    value={companyInfo.addressLine2}
                    onChange={this.handleChange}
                  />
                  {/* <input
                    type="text"
                    id="addressLine3"
                    name="addressLine3"
                    placeholder="Street Address Line 3"
                    onChange={this.handleChange}
                  /> */}
                  <br />
                  <select
                    className="oneThirdWidth"
                    id="country"
                    name="country"
                    onChange={this.handleChange}
                    value={companyInfo.country}
                  >
                    <option value="IN">India</option>
                    <option value="AUS">Australia</option>
                    <option value="CN">Canada</option>
                    <option value="US">USA</option>
                  </select>
                  <input
                    className="oneThirdWidth"
                    type="text"
                    id="region"
                    name="region"
                    placeholder="Enter State"
                    value={companyInfo.region}
                    onChange={this.handleChange}
                  />
                  <input
                    className="oneThirdWidth"
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter City"
                    value={companyInfo.city}
                    onChange={this.handleChange}
                  />
                  <input
                    type="number"
                    className="halfWidth"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter Pin Code"
                    value={companyInfo.postalCode}
                    onChange={this.handleChange}
                  />
                  <input
                    type="tel"
                    className="halfWidth"
                    id="lname"
                    name="phoneNumber"
                    placeholder="Enter Phone Number"
                    value={companyInfo.phoneNumber}
                    onChange={this.handleChange}
                  />
                  <br />
                </span>
                <br />
              </div>
              <label>Primary Admin Name</label>
              <input
                className="halfWidth"
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={companyInfo.firstName}
                onChange={this.handleChange}
              />
              <input
                className="halfWidth"
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={companyInfo.lastName}
                onChange={this.handleChange}
              />
              <br />
              <label>Admin Username</label>
              <input
                type="text"
                className="halfWidth"
                id="username"
                name="username"
                value={companyInfo.username}
                onChange={this.handleChange}
              />
              <span className="domain-name"> @{companyInfo.domain} </span>
              <br />
              <label>Alternate Email</label>
              <input
                type="text"
                id="lname"
                name="alternateEmail"
                value={companyInfo.alternateEmail}
                placeholder="Enter email address that's not in above entered domain"
                onChange={this.handleChange}
              />
              <br />
              <label>(All fields are mandatory)</label>
              <input
                className="separatingMargin"
                type="submit"
                defaultValue="Submit"
              />
              <br />
            </form>
          </div>
        </div>
        <div className="container">
          <div className="sub-container customer ">
            <div className="customer-heading">
              <span className="billable-id">Billable ID</span>
              <span className="phone-number">Phone Number</span>
              <span className="plan-id">Plan ID</span>
              <span className="cirlce">Circle</span>
              <span className="first-name">First Name</span>
              <span className="last-name">Last Name</span>
              <span className="email-id">Email ID</span>
            </div>
            {this.renderDynamicFormFields()}
            <button className="addNew" onClick={this.handleAdd}>
              Add New
            </button>
          </div>
        </div>
      </div>
    );
  }
}
