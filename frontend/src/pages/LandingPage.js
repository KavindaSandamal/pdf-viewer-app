import React from "react";
import PropTypes from "prop-types";

import Header from "./Header.jsx";
import HeaderBanner from "./HeaderBanner.jsx";
import Footer from "./Footer.jsx";

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
