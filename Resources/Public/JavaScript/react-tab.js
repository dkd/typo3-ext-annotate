!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("React"),require("ReactDOM")):"function"==typeof define&&define.amd?define(["React","ReactDOM"],t):"object"==typeof exports?exports.ReactTabs=t(require("React"),require("ReactDOM")):e.ReactTabs=t(e.React,e.ReactDOM)}(this,function(e,t){return function(e){function t(s){if(r[s])return r[s].exports;var n=r[s]={exports:{},id:s,loaded:!1};return e[s].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var r={};return t.m=e,t.c=r,t.p="",t(0)}([function(e,t,r){"use strict";e.exports={Tabs:r(1),TabList:r(9),Tab:r(8),TabPanel:r(11)}},function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}function n(e){return"LI"===e.nodeName&&"tab"===e.getAttribute("role")}function a(e){return"true"===e.getAttribute("aria-disabled")}var o=r(2),i=s(o),l=r(3),d=r(4),c=s(d),u=r(5),p=s(u),f=r(6),b=s(f),h=r(7),T=s(h),y=!0;e.exports=i["default"].createClass({displayName:"Tabs",propTypes:{className:o.PropTypes.string,selectedIndex:o.PropTypes.number,onSelect:o.PropTypes.func,focus:o.PropTypes.bool,children:T["default"],forceRenderTabPanel:o.PropTypes.bool},childContextTypes:{forceRenderTabPanel:o.PropTypes.bool},statics:{setUseDefaultStyles:function(e){y=e}},getDefaultProps:function(){return{selectedIndex:-1,focus:!1,forceRenderTabPanel:!1}},getInitialState:function(){return this.copyPropsToState(this.props)},getChildContext:function(){return{forceRenderTabPanel:this.props.forceRenderTabPanel}},componentDidMount:function(){y&&p["default"](r(10))},componentWillReceiveProps:function(e){this.setState(this.copyPropsToState(e))},handleClick:function(e){var t=e.target;do if(n(t)){if(a(t))return;var r=[].slice.call(t.parentNode.children).indexOf(t);return void this.setSelected(r)}while(null!==(t=t.parentNode))},handleKeyDown:function(e){if(n(e.target)){var t=this.state.selectedIndex,r=!1;37===e.keyCode||38===e.keyCode?(t=this.getPrevTab(t),r=!0):(39===e.keyCode||40===e.keyCode)&&(t=this.getNextTab(t),r=!0),r&&e.preventDefault(),this.setSelected(t,!0)}},setSelected:function(e,t){if(e!==this.state.selectedIndex&&!(0>e||e>=this.getTabsCount())){var r=this.state.selectedIndex;this.setState({selectedIndex:e,focus:t===!0}),"function"==typeof this.props.onSelect&&this.props.onSelect(e,r)}},getNextTab:function(e){for(var t=this.getTabsCount(),r=e+1;t>r;r++){var s=this.getTab(r);if(!a(l.findDOMNode(s)))return r}for(var r=0;e>r;r++){var s=this.getTab(r);if(!a(l.findDOMNode(s)))return r}return e},getPrevTab:function(e){for(var t=e;t--;){var r=this.getTab(t);if(!a(l.findDOMNode(r)))return t}for(t=this.getTabsCount();t-->e;){var r=this.getTab(t);if(!a(l.findDOMNode(r)))return t}return e},getTabsCount:function(){return this.props.children&&this.props.children[0]?i["default"].Children.count(this.props.children[0].props.children):0},getPanelsCount:function(){return i["default"].Children.count(this.props.children.slice(1))},getTabList:function(){return this.refs.tablist},getTab:function(e){return this.refs["tabs-"+e]},getPanel:function(e){return this.refs["panels-"+e]},getChildren:function(){for(var e=0,t=0,r=this.props.children,s=this.state,n=this.tabIds=this.tabIds||[],a=this.panelIds=this.panelIds||[],l=this.tabIds.length-this.getTabsCount();l++<0;)n.push(b["default"]()),a.push(b["default"]());return i["default"].Children.map(r,function(r){if(null===r)return null;var l=null;if(0===t++)l=o.cloneElement(r,{ref:"tablist",children:i["default"].Children.map(r.props.children,function(t){if(null===t)return null;var r="tabs-"+e,i=n[e],l=a[e],d=s.selectedIndex===e,c=d&&s.focus;return e++,o.cloneElement(t,{ref:r,id:i,panelId:l,selected:d,focus:c})})}),e=0;else{var d="panels-"+e,c=a[e],u=n[e],p=s.selectedIndex===e;e++,l=o.cloneElement(r,{ref:d,id:c,tabId:u,selected:p})}return l})},render:function(){var e=this;return this.state.focus&&setTimeout(function(){e.state.focus=!1},0),i["default"].createElement("div",{className:c["default"]("ReactTabs","react-tabs",this.props.className),onClick:this.handleClick,onKeyDown:this.handleKeyDown},this.getChildren())},copyPropsToState:function(e){var t=e.selectedIndex;return-1===t&&(t=this.state&&this.state.selectedIndex?this.state.selectedIndex:0),{selectedIndex:t,focus:e.focus}}})},function(t,r){t.exports=e},function(e,r){e.exports=t},function(e,t,r){var s;/*!
    Copyright (c) 2015 Jed Watson.
    Licensed under the MIT License (MIT), see
    http://jedwatson.github.io/classnames
  */
!function(){"use strict";function n(){for(var e="",t=0;t<arguments.length;t++){var r=arguments[t];if(r){var s=typeof r;if("string"===s||"number"===s)e+=" "+r;else if(Array.isArray(r))e+=" "+n.apply(null,r);else if("object"===s)for(var o in r)a.call(r,o)&&r[o]&&(e+=" "+o)}}return e.substr(1)}var a={}.hasOwnProperty;"undefined"!=typeof e&&e.exports?e.exports=n:(s=function(){return n}.call(t,r,t,e),!(void 0!==s&&(e.exports=s)))}()},function(e,t,r){!function(){function t(e){var t=[];for(var s in e)t.push(r(s,e[s]));n(t)}function r(e,t){return e+" {\n"+s(t)+"\n}"}function s(e){var t=[];for(var r in e)t.push("  "+r+": "+e[r]+";");return t.join("\n")}function n(e){var t=document.getElementById("jss-styles");if(!t){t=document.createElement("style"),t.setAttribute("id","jss-styles");var r=document.getElementsByTagName("head")[0];r.insertBefore(t,r.firstChild)}var s=document.createTextNode(e.join("\n\n"));t.appendChild(s)}e.exports=t}()},function(e,t){"use strict";var r=0;e.exports=function(){return"react-tabs-"+r++}},function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}var n=r(2),a=s(n),o=r(8),i=s(o),l=r(9),d=s(l);e.exports=function(e,t){var r=void 0,s=0,n=0,o=e[t];return a["default"].Children.forEach(o,function(e){null!==e&&(e.type===d["default"]?a["default"].Children.forEach(e.props.children,function(e){null!==e&&(e.type===i["default"]?s++:r=new Error("Expected `Tab` but found `"+(e.type.displayName||e.type)+"`"))}):"TabPanel"===e.type.displayName?n++:r=new Error("Expected `TabList` or `TabPanel` but found `"+(e.type.displayName||e.type)+"`"))}),s!==n&&(r=new Error("There should be an equal number of `Tabs` and `TabPanels`. Received "+s+" `Tabs` and "+n+" `TabPanels`.")),r}},function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}function n(e,t){t.selected?(e.setAttribute("tabindex",0),e.setAttribute("selected","selected"),t.focus&&e.focus()):(e.removeAttribute("tabindex"),e.removeAttribute("selected"))}var a=r(2),o=s(a),i=r(3),l=r(4),d=s(l);e.exports=o["default"].createClass({displayName:"Tab",propTypes:{className:a.PropTypes.string,id:a.PropTypes.string,selected:a.PropTypes.bool,disabled:a.PropTypes.bool,panelId:a.PropTypes.string,children:a.PropTypes.oneOfType([a.PropTypes.array,a.PropTypes.object,a.PropTypes.string])},getDefaultProps:function(){return{focus:!1,selected:!1,id:null,panelId:null}},componentDidMount:function(){n(i.findDOMNode(this),this.props)},componentDidUpdate:function(){n(i.findDOMNode(this),this.props)},render:function(){return o["default"].createElement("li",{className:d["default"]("ReactTabs__Tab",this.props.className,{"ReactTabs__Tab--selected":this.props.selected,"ReactTabs__Tab--disabled":this.props.disabled}),role:"tab",id:this.props.id,"aria-selected":this.props.selected?"true":"false","aria-expanded":this.props.selected?"true":"false","aria-disabled":this.props.disabled?"true":"false","aria-controls":this.props.panelId},this.props.children)}})},function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}var n=r(2),a=s(n),o=r(4),i=s(o);e.exports=a["default"].createClass({displayName:"TabList",propTypes:{className:n.PropTypes.string,children:n.PropTypes.oneOfType([n.PropTypes.object,n.PropTypes.array])},render:function(){return a["default"].createElement("ul",{className:i["default"]("ReactTabs__TabList",this.props.className),role:"tablist"},this.props.children)}})},function(e,t){"use strict";e.exports={".react-tabs [role=tablist]":{"border-bottom":"1px solid #aaa",margin:"0 0 10px",padding:"0"},".react-tabs [role=tab]":{display:"inline-block",border:"1px solid transparent","border-bottom":"none",bottom:"-1px",position:"relative","list-style":"none",padding:"6px 12px",cursor:"pointer"},".react-tabs [role=tab][aria-selected=true]":{background:"#fff","border-color":"#aaa",color:"black","border-radius":"5px 5px 0 0","-moz-border-radius":"5px 5px 0 0","-webkit-border-radius":"5px 5px 0 0"},".react-tabs [role=tab][aria-disabled=true]":{color:"GrayText",cursor:"default"},".react-tabs [role=tab]:focus":{"box-shadow":"0 0 5px hsl(208, 99%, 50%)","border-color":"hsl(208, 99%, 50%)",outline:"none"},".react-tabs [role=tab]:focus:after":{content:'""',position:"absolute",height:"5px",left:"-4px",right:"-4px",bottom:"-5px",background:"#fff"}}},function(e,t,r){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}var n=r(2),a=s(n),o=r(4),i=s(o);e.exports=a["default"].createClass({displayName:"TabPanel",propTypes:{className:n.PropTypes.string,selected:n.PropTypes.bool,id:n.PropTypes.string,tabId:n.PropTypes.string,children:n.PropTypes.oneOfType([n.PropTypes.array,n.PropTypes.object,n.PropTypes.string])},contextTypes:{forceRenderTabPanel:n.PropTypes.bool},getDefaultProps:function(){return{selected:!1,id:null,tabId:null}},render:function(){var e=this.context.forceRenderTabPanel||this.props.selected?this.props.children:null;return a["default"].createElement("div",{className:i["default"]("ReactTabs__TabPanel",this.props.className,{"ReactTabs__TabPanel--selected":this.props.selected}),role:"tabpanel",id:this.props.id,"aria-labelledby":this.props.tabId,style:{display:this.props.selected?null:"none"}},e)}})}])});
//# sourceMappingURL=react-tabs.min.js.map