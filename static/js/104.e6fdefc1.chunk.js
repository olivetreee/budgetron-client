"use strict";(self.webpackChunkbudgetron_client=self.webpackChunkbudgetron_client||[]).push([[104],{6104:function(t,n,e){e.r(n),e.d(n,{ExpenseReport:function(){return h},default:function(){return m}});var o=e(4942),r=e(1413),a=e(9439),u=e(3578),i=e(2758),c=e(2703),l=e(184),f=function(t){var n=t.data,e={normal:{labels:{enabled:!1},fill:function(){return"DEFICIT"===this.from?"#384660":"Total Income"===this.to?"#3498db":"#e74c3c"}},hovered:{labels:{enabled:!1},fill:function(){return"DEFICIT"===this.from?"#384660aa":"Total Income"===this.to?"#3498dbaa":"#e74c3caa"}},tooltip:{format:function(){return(0,c.qz)(this.value,!1)}}},o={tooltip:{format:function(){return(0,c.qz)(this.value,!1)},titleFormat:function(){return this.name}},fill:function(){return"Total Income"===this.name?"#2e9a5b":"DEFICIT"===this.name?"#7f8c8d":this.sourceColor}},r={normal:{fill:"#2ecc71"},hovered:{fill:"#2ecc71aa"},tooltip:{format:function(){return(0,c.qz)(this.value,!1)},titleFormat:"Leftovers"}};return(0,l.jsx)(l.Fragment,{children:(0,l.jsx)(i.Z,{type:"sankey",data:n,background:"transparent",height:800,curveFactor:.5,nodePadding:15,flow:e,node:o,dropoff:r,nodeWidth:"20%"})})},s=e(6624),d=e(8539),h=function(){var t=(0,d.nC)().state,n=t.items,e=(t.grouping||{}).category,i=(0,s.L_)(),c=(0,a.Z)(i,1)[0],h=c.categoriesByType,m=h.expense,v=void 0===m?[]:m,p=h.income,g=void 0===p?[]:p,I=c.loading;if(t.loading||I)return(0,l.jsx)(u.T,{});var b=g.reduce((function(t,a){var u=t;return e[a]&&(u=(0,r.Z)((0,r.Z)({},t),{},(0,o.Z)({},a,e[a].map((function(t){return n[t]}))))),u}),{}),T=v.reduce((function(t,a){var u=t;return e[a]&&(u=(0,r.Z)((0,r.Z)({},t),{},(0,o.Z)({},a,e[a].map((function(t){return n[t]}))))),u}),{}),Z=0,C=[];Object.entries(b).forEach((function(t){var n=(0,a.Z)(t,2),e=n[0],o=n[1].reduce((function(t,n){return Math.round(t+n.amount)}),0);Z+=o,C.push({from:e,to:"Total Income",weight:o})}));var F=0;Object.entries(T).forEach((function(t){var n=(0,a.Z)(t,2),e=n[0],o=n[1].reduce((function(t,n){var e;return Math.round(t+n.amount)-((null===(e=n.copayments)||void 0===e?void 0:e.total)||0)}),0);F+=o,C.push({from:"Total Income",to:e,weight:o})}));var w=Z-F;return w>0&&C.push({from:"Total Income",to:null,weight:w}),w<0&&C.push({from:"DEFICIT",to:"Total Income",weight:-1*w}),(0,l.jsx)(f,{data:C})},m=h}}]);
//# sourceMappingURL=104.e6fdefc1.chunk.js.map