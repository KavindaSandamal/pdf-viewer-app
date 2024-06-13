import React from "react";
import PropTypes from "prop-types";
import HeaderBanner from "./HeaderBanner.js";
import Footer from "./Footer.js";

const Components = () => {
    return (
        <div>
            <HeaderBanner />
            <Footer />
        </div>
    );
}

Components.propTypes = {
    classes: PropTypes.object
};

export default Components;
