(function(e){function t(t){for(var i,s,r=t[0],a=t[1],l=t[2],d=0,m=[];d<r.length;d++)s=r[d],Object.prototype.hasOwnProperty.call(n,s)&&n[s]&&m.push(n[s][0]),n[s]=0;for(i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i]);u&&u(t);while(m.length)m.shift()();return c.push.apply(c,l||[]),o()}function o(){for(var e,t=0;t<c.length;t++){for(var o=c[t],i=!0,r=1;r<o.length;r++){var a=o[r];0!==n[a]&&(i=!1)}i&&(c.splice(t--,1),e=s(s.s=o[0]))}return e}var i={},n={createnew:0},c=[];function s(t){if(i[t])return i[t].exports;var o=i[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,s),o.l=!0,o.exports}s.m=e,s.c=i,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)s.d(o,i,function(t){return e[t]}.bind(null,i));return o},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],a=r.push.bind(r);r.push=t,r=r.slice();for(var l=0;l<r.length;l++)t(r[l]);var u=a;c.push([2,"chunk-vendors"]),o()})({2:function(e,t,o){e.exports=o("bd48")},"486e":function(e,t,o){"use strict";o.d(t,"a",(function(){return i}));o("ac1f"),o("5319"),o("a9e3"),o("9129");var i=function(e,t,o){o.valid[e]=!(!t||"default"===t||""===t)}},"4eb9":function(e,t,o){"use strict";o("9b3e")},"66fe":function(e,t,o){"use strict";o("bbc4")},9191:function(e,t,o){"use strict";o.d(t,"a",(function(){return s}));var i=o("bc3a"),n=o.n(i),c="http://127.0.0.1:8000/";c="https://artnav.terraamericanart.org/";var s=n.a.create({baseURL:"".concat(c,"api/")})},"9b3e":function(e,t,o){},a421:function(e,t,o){"use strict";var i=o("7a23"),n={class:"mini-loader_wrap"};function c(e,t,o,c,s,r){return Object(i["openBlock"])(),Object(i["createElementBlock"])("div",n,[Object(i["createElementVNode"])("div",{class:Object(i["normalizeClass"])(["sp-3balls",o.colorClass]),style:Object(i["normalizeStyle"])(o.additionalStyles)},null,6)])}var s={props:["colorClass","additionalStyles"]},r=(o("4eb9"),o("d959")),a=o.n(r);const l=a()(s,[["render",c]]);t["a"]=l},bbc4:function(e,t,o){},bd48:function(e,t,o){"use strict";o.r(t);o("e260"),o("e6cf"),o("cca6"),o("a79d");var i=o("e8d1"),n=(o("5377"),o("7a23")),c={class:"modal-dialog",role:"document"},s={class:"modal-content new_artwork"},r={class:"form-group"},a=Object(n["createElementVNode"])("label",{for:"art_title"},"Artwork Title",-1),l=Object(n["createElementVNode"])("small",{id:"imageHelp",class:"form-text text-muted"},"Required",-1),u={class:"form-group"},d=Object(n["createElementVNode"])("label",{for:"art_title"},"Date of Creation",-1),m=Object(n["createElementVNode"])("small",{id:"imageHelp",class:"form-text text-muted"},"Required",-1),f={class:"form-group artist-form-field"},_=Object(n["createElementVNode"])("label",{for:"art_artist"},"Artist Name",-1),b=Object(n["createElementVNode"])("small",{id:"imageHelp",class:"form-text text-muted"},"Required",-1),h={class:"auto-complete-input"},p={key:0,class:"new-obj-indicator"},w={key:1,class:"auto-complete-list"},v=["onClick"],O={class:"form-group"},j=Object(n["createElementVNode"])("label",{for:"catalog_id"},"Accession Number",-1),S={class:"form-group"},g=Object(n["createElementVNode"])("label",{for:"catalog_id"},"IIIF Image ID",-1),k=Object(n["createElementVNode"])("small",{id:"imageHelp",class:"form-text text-muted"},"Required",-1),N={class:"modal-foot"},C={class:"form-group"},E=["disabled"],V=["disabled"],y={class:"loading-view"},T={class:"loading-view-wrap"},A={class:"loader-wrap"},x=Object(n["createElementVNode"])("h1",null,"Uploading Artwork",-1),I=Object(n["createElementVNode"])("p",null,"Larger file sizes can take up to 5 minutes.",-1),F={class:"progress-elements"},U={class:"loading_percent"},D={class:"material-icons"},L=["width","height"],B=["stroke-width","stroke-dasharray","cx","cy","r"],M=["stroke-width","stroke-dasharray","stroke-dashoffset","cx","cy","r"];function P(e,t,o,i,P,R){var X=Object(n["resolveComponent"])("MiniLoader");return Object(n["openBlock"])(),Object(n["createElementBlock"])("div",c,[Object(n["createElementVNode"])("div",s,[Object(n["createElementVNode"])("div",{class:Object(n["normalizeClass"])(["modal-body",{loading:R.isSaving||R.isSuccess}])},[Object(n["createElementVNode"])("div",r,[a,l,Object(n["withDirectives"])(Object(n["createElementVNode"])("input",{class:"form-control",type:"text",id:"art_title",placeholder:"Title...","onUpdate:modelValue":t[0]||(t[0]=function(e){return P.submission.artwork_title=e})},null,512),[[n["vModelText"],P.submission.artwork_title]])]),Object(n["createElementVNode"])("div",u,[d,m,Object(n["withDirectives"])(Object(n["createElementVNode"])("input",{class:"form-control",type:"text",id:"art_date",placeholder:"Date...","onUpdate:modelValue":t[1]||(t[1]=function(e){return P.submission.artwork_creation_date=e})},null,512),[[n["vModelText"],P.submission.artwork_creation_date]])]),Object(n["createElementVNode"])("div",f,[_,b,Object(n["createElementVNode"])("div",h,[Object(n["withDirectives"])(Object(n["createElementVNode"])("input",{type:"text",class:"form-control",placeholder:"Search for an existing artist or add a new one",onKeydown:t[2]||(t[2]=function(e){return P.flags.autocomplete_selections.artist=!1}),onClick:t[3]||(t[3]=function(e){return P.flags.autocomplete_selections.artist=!1}),"onUpdate:modelValue":t[4]||(t[4]=function(e){return P.local_input.artist_name=e})},null,544),[[n["vModelText"],P.local_input.artist_name]]),P.new_artist.artist_name?(Object(n["openBlock"])(),Object(n["createElementBlock"])("span",p,"New Artist")):Object(n["createCommentVNode"])("",!0),P.autocompletes.artists?(Object(n["openBlock"])(),Object(n["createElementBlock"])("ul",w,[(Object(n["openBlock"])(!0),Object(n["createElementBlock"])(n["Fragment"],null,Object(n["renderList"])(P.autocompletes.artists,(function(e,t){return Object(n["openBlock"])(),Object(n["createElementBlock"])("li",{key:"found-artist-".concat(t),onClick:function(t){return R.autoCompleteSelectArtist("artist",e,"artist_name")}},Object(n["toDisplayString"])(e.artist_name),9,v)})),128))])):Object(n["createCommentVNode"])("",!0)])]),Object(n["createElementVNode"])("div",O,[j,Object(n["withDirectives"])(Object(n["createElementVNode"])("input",{class:"form-control",type:"text",id:"accession_number",placeholder:"Accession Number...","onUpdate:modelValue":t[5]||(t[5]=function(e){return P.submission.accession_number=e})},null,512),[[n["vModelText"],P.submission.accession_number]])]),Object(n["createElementVNode"])("div",S,[g,k,Object(n["withDirectives"])(Object(n["createElementVNode"])("input",{class:"form-control",type:"text",id:"iiif_id",placeholder:"IIIF ID...","onUpdate:modelValue":t[6]||(t[6]=function(e){return P.submission.iiif_uuid=e})},null,512),[[n["vModelText"],P.submission.iiif_uuid]])])],2),Object(n["createElementVNode"])("div",N,[Object(n["createElementVNode"])("div",C,[Object(n["createElementVNode"])("button",{class:"btn artmap-secondary","data-toggle":"modal","data-target":"#newArtmap",disabled:R.isSaving}," Cancel ",8,E),Object(n["createElementVNode"])("button",{class:"btn artmap-primary",onClick:t[7]||(t[7]=function(){return R.save&&R.save.apply(R,arguments)}),disabled:!P.validForm},[Object(n["withDirectives"])(Object(n["createElementVNode"])("span",null,"Create",512),[[n["vShow"],R.isInitial]]),Object(n["withDirectives"])(Object(n["createElementVNode"])("span",null,[Object(n["createVNode"])(X)],512),[[n["vShow"],R.isSaving||R.isSuccess]])],8,V)])])]),Object(n["withDirectives"])(Object(n["createElementVNode"])("div",y,[Object(n["createElementVNode"])("div",T,[Object(n["createElementVNode"])("div",A,[x,I,Object(n["createElementVNode"])("div",F,[Object(n["createElementVNode"])("span",U,[Object(n["withDirectives"])(Object(n["createElementVNode"])("i",D,"",512),[[n["vShow"],R.isSuccess]]),Object(n["withDirectives"])(Object(n["createElementVNode"])("span",null,Object(n["toDisplayString"])(P.loaded_percent)+"%",513),[[n["vShow"],!R.isSuccess]])]),(Object(n["openBlock"])(),Object(n["createElementBlock"])("svg",{width:2*P.circle_loader.radius+2*P.circle_loader.stroke_width,height:2*P.circle_loader.radius+2*P.circle_loader.stroke_width},[Object(n["createElementVNode"])("circle",{id:"loading-track","stroke-width":P.circle_loader.stroke_width,"stroke-dasharray":R.circumference,"stroke-dashoffset":0,cx:P.circle_loader.radius+P.circle_loader.stroke_width,cy:P.circle_loader.radius+P.circle_loader.stroke_width,r:P.circle_loader.radius,transform:"",class:"outer"},null,8,B),Object(n["createElementVNode"])("circle",{"stroke-width":P.circle_loader.stroke_width,"stroke-dasharray":R.circumference,"stroke-dashoffset":R.circularLoadedPercent,cx:P.circle_loader.radius+P.circle_loader.stroke_width,cy:P.circle_loader.radius+P.circle_loader.stroke_width,r:P.circle_loader.radius,transform:"",class:"outer"},null,8,M)],8,L))]),Object(n["createElementVNode"])("p",{class:Object(n["normalizeClass"])(["redirect-notice",{show_notice:R.isSuccess}])},"Redirecting...",2)])])],512),[[n["vShow"],R.isSaving||R.isSuccess]])])}o("ac1f"),o("5319"),o("4de4"),o("d3b7"),o("b64b"),o("a9e3");var R=o("9191"),X=o("a421"),q=o("486e"),z=o("2ef0"),H=o.n(z),G={data:function(){return{csrf:window.csrf,userId:window.user_id,options:{artists:null,collections:null},autocompletes:{artists:null,collections:null},flags:{autocomplete_selections:{artist:!1,collection:!1}},loaded_percent:0,create_step:1,circle_loader:{radius:50,dash_offset:0,stroke_width:2},form_data:new FormData,local_input:{artist_name:null,collection_title:null},new_artist:{artist_name:null},new_collection:{collection_title:null,artworks:[]},selected_collection:null,submission:{artwork_title:null,artwork_creation_date:null,artwork_slug:null,artist:null,curator:window.user_id,curator_id:window.user_id,accession_number:null,iiif_uuid:null},currentStatus:0,s:{STATUS_INITIAL:0,STATUS_SAVING:1,STATUS_SUCCESS:2,STATUS_FAILED:3},valid:{artwork_title:!1,artwork_creation_date:!1,artist_name:!1,accession_number:!1,iiif_uuid:!1},validForm:!1}},computed:{isInitial:function(){return this.currentStatus===this.s.STATUS_INITIAL},isSaving:function(){return this.currentStatus===this.s.STATUS_SAVING},isSuccess:function(){return this.currentStatus===this.s.STATUS_SUCCESS},isFailed:function(){return this.currentStatus===this.s.STATUS_FAILED},circumference:function(){return 2*Math.PI*this.circle_loader.radius},circularLoadedPercent:function(){var e=this.loaded_percent,t=Math.PI*(2*this.circle_loader.radius);e<0&&(e=0),e>100&&(e=100);var o=(100-e)/100*t;return o}},watch:{"submission.artwork_title":function(e){var t=e.replace(/[^A-Z0-9]+/gi,"-").toLowerCase().toLowerCase();this.submission.artwork_slug=t,Object(q["a"])("artwork_title",e,this),this.submissionCheck()},"submission.artwork_creation_date":function(e){Object(q["a"])("artwork_creation_date",e,this),this.submissionCheck()},"submission.accession_number":function(e){Object(q["a"])("accession_number",e,this),this.submissionCheck()},"submission.iiif_uuid":function(e){Object(q["a"])("iiif_uuid",e,this),this.submissionCheck()},"local_input.artist_name":function(e){var t;this.flags.autocomplete_selections.artist?(this.autocompletes.artists=null,this.new_artist.artist_name=null):e?(t=H.a.filter(this.options.artists,(function(t){return t.artist_name.toLowerCase().indexOf(e.toLowerCase())>-1})),t.length>0?this.autocompletes.artists=t:(this.autocompletes.artists=null,this.new_artist.artist_name=e)):(this.autocompletes.artists=null,this.new_artist.artist_name=null),Object(q["a"])("artist_name",e,this),this.submissionCheck()},"local_input.collection_title":function(e){var t;this.flags.autocomplete_selections.collection?(this.autocompletes.collections=null,this.new_collection.collection_title=null):e?(t=H.a.filter(this.options.collections,(function(t){return t.collection_title.toLowerCase().indexOf(e.toLowerCase())>-1})),t.length>0?this.autocompletes.collections=t:(this.autocompletes.collections=null,this.new_collection.collection_title=e)):(this.autocompletes.collections=null,this.new_collection.collection_title=null)}},methods:{submissionCheck:function(){var e=0,t=Object.keys(this.valid).length;for(var o in this.valid)this.valid[o]&&e++;this.validForm=e===t},handleCollectionInputKeyDown:function(){this.flags.autocomplete_selections.collection=!1,this.selected_collection=null},autoCompleteSelectArtist:function(e,t,o){this.flags.autocomplete_selections.artist=!0,this.submission[e]=t.id,this.local_input[o]=t[o]},autoCompleteSelectCollection:function(e,t){this.flags.autocomplete_selections.collection=!0,this.selected_collection=e.id,this.local_input[t]=e[t]},saveNewArtistFirst:function(e){R["a"].post("artists/",this.new_artist,{headers:{"X-CSRFToken":window.csrf}}).then((function(t){e(t)}),(function(e){console.log(e)}))},saveNewCollectionFirst:function(e){this.new_collection["curator"]=Number(window.user_id),this.new_collection["curator_id"]=Number(window.user_id),this.new_collection["collection_slug"]=this.new_collection.collection_title.replace(/[^A-Z0-9]+/gi,"-").toLowerCase().toLowerCase(),R["a"].post("artcollections/",this.new_collection,{headers:{"X-CSRFToken":window.csrf}}).then((function(t){e(t)}),(function(e){console.log(e)}))},save:function(){this.currentStatus=this.s.STATUS_SAVING;var e=this;this.new_artist.artist_name||this.new_collection.collection_title?this.new_artist.artist_name&&this.new_collection.collection_title?this.saveNewArtistFirst((function(t){e.submission.artist=t.data.id,e.saveNewCollectionFirst((function(t){e.saveSubmission(!0,t.data.id)}))})):this.new_artist.artist_name?this.saveNewArtistFirst((function(t){e.submission.artist=t.data.id,e.saveSubmission()})):this.new_collection.collection_title&&this.saveNewCollectionFirst((function(t){e.saveSubmission(!0,t.data.id)})):this.saveSubmission()},addArtToCollection:function(e,t,o){var i,n=this,c=this;R["a"].get("artcollections/".concat(e,"/"),{headers:{"X-CSRFToken":window.csrf}}).then((function(s){i=s.data,i.artworks.push(t),R["a"].put("artcollections/".concat(e,"/"),i,{headers:{"X-CSRFToken":window.csrf}}).then((function(e){c.currentStatus=n.s.STATUS_SUCCESS,setTimeout((function(){window.location="/art/".concat(o,"/")}),500)}),(function(e){console.log(e)}))}),(function(e){console.log(e)}))},saveSubmission:function(e,t){var o=this,i=this;R["a"].post("art/",this.submission,{headers:{"X-CSRFToken":window.csrf}}).then((function(n){e?o.addArtToCollection(t,n.data.id,n.data.artwork_slug):o.selected_collection?o.addArtToCollection(i.selected_collection,n.data.id,n.data.artwork_slug):(o.currentStatus=i.s.STATUS_SUCCESS,setTimeout((function(){window.location="/art/".concat(n.data.artwork_slug,"/")}),500))}),(function(e){console.log(e)}))},getArtists:function(){var e=this;R["a"].get("artists/").then((function(t){e.options.artists=t.data}),(function(e){console.log(e)}))},getCollections:function(){var e=this;R["a"].get("artcollections/").then((function(t){e.options.collections=t.data}),(function(e){console.log(e)}))},saveNewArtmap:function(){R["a"].post("art",this.submission,{headers:{"X-CSRFToken":window.csrf}}).then((function(e){window.location="/art/".concat(e.data.artwork_slug,"/")}),(function(e){console.log(e)}))}},mounted:function(){var e=this;this.getArtists(),this.getCollections(),setTimeout((function(){e.submission.curator=window.user_id,e.submission.curator_id=window.user_id}),0)},components:{MiniLoader:X["a"]}},J=(o("66fe"),o("d959")),K=o.n(J);const Z=K()(G,[["render",P]]);var Q=Z;Object(i["a"])(Q,null,null,"#createnew")},e8d1:function(e,t,o){"use strict";o.d(t,"a",(function(){return r}));var i=o("5530"),n=o("7a23"),c=o("1344"),s=o("6676"),r=function(e,t,o,r){var a=Object(c["a"])(),l=document.querySelector(r),u=Object(n["createApp"])(e,Object(i["a"])({},l.dataset));return u.config.globalProperties.emitter=a,t&&u.use(t),o&&u.use(o),u.use(s["a"],{autoSetContainer:!0,appendToBody:!0}),u.mount(r),u}}});