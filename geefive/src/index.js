Ext.ns('geefive');

Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
      // Login Form
      var user = {id: 0};
      var loggedIn = function(){
        return user.id > 0;
      };
      
      var getUserName = function(){
        if(user.name){
          return user.name;
        }else{
          return '';
        }
      };
      
      // Login to geefive client center
      var clientCenterLogin = function(data,b){
        Ext.Ajax.request({
          url: '/user/mobile_login',
          params: data,
          success: function(response,opts){
            var r = Ext.decode(response.responseText);
            user = r.user;
            b.setText('Login');
            if(r.user.id == 0){
              form.show();
              console.log(form);
              form.setValues({login: 'Invalid Login', password: ''});
            }else{
              loadingWindow.hide();
              showHideLogout();
              form.hide();
            }
          }
        })
      };
      
      // Get geefive client center status
      var checkClientCenterLogin = function() {
        Ext.Ajax.request({
          url: '/user/mobile_user',
          success: function(response, opts) {
            var r = Ext.decode(response.responseText);
            user = r.user;
            if(r.user.id == 0){
              form.show();
            }else{
              showHideLogout();
              loadingWindow.hide();
              form.hide();
            }
          }
        })
      };
      
      var callData = [];
      
      var loadCalls = function() {
        Ext.Ajax.request({
          url: '/user/mobile_calls',
          success: function(response, opts) {
            var r = Ext.decode(response.responseText);
            callData = r.calls;
            callStore.loadData(callData);
            Ext.getBody().unmask();
          }
        })
      };
      
      checkClientCenterLogin();
      
      var showHideLogout = function(){
        if(user.id > 0){
          logoutTab.show();
        }else{
          logoutTab.hide();
        }
      }
      
      // Add Logout Tab
      var logoutTab = new Ext.Tab({
        title: 'Logout',
        iconCls: 'download',
        hidden: true,
        listeners: {
          'activate': function(t){ 
            loadingWindow.show();
            user = {id: 0};
            Ext.Ajax.request({
              url: '/user/logout',
              success: function(){
                loadingWindow.hide();
                form.show();
              }
            });
          }
        }
      });
      
      // Expose some functions to geefive namespace
      geefive.loggedIn = loggedIn;
      geefive.getUserName = getUserName
      
      // Login Form
      var formBase = {
        scroll: 'vertical',
        items: [{
          xtype: 'fieldset',
          title: '<img src="g5-small.jpg"> Mobile',
          instructions: 'Please enter the information above.',
          defaults: {
            required: true,
            labelAlign: 'left'
          },
          items: [{
            xtype: 'textfield',
            name : 'login',
            label: 'User Name'
          },{
            xtype: 'passwordfield',
            name : 'password',
            label: 'Password'
          }]
        }],
        dockedItems: [{
          xtype: 'toolbar',
          dock: 'bottom',
          items: [{
            text: 'Reset',
            handler: function() {
              form.reset();
            }
          },{
            text: 'Login',
            ui: 'action',
            handler: function(b) {
              var v = form.getValues();
              b.setText('Logging In...');
              clientCenterLogin(v,b);
            }
          }]
        }]
      };
      
      if (Ext.platform.isAndroidOS) {
          formBase.items.unshift({
              xtype: 'component',
              styleHtmlContent: true,
              html: '<span style="color: red">Forms on Android are currently under development. We are working hard to improve this in upcoming releases.</span>'
          });
      }
      
      if (Ext.platform.isPhone) {
          formBase.fullscreen = true;
      } else {
          Ext.apply(formBase, {
              autoRender: true,
              floating: true,
              modal: true,
              centered: true,
              hideOnMaskTap: false,
              height: 285,
              width: 340
          });
      };
      
      var loadingWindow = new Ext.Panel({
        autoRender: true,
        floating: true,
        modal: true,
        centered: true,
        hideOnMaskTap: false,
        height: 220,
        width: 220,
        html: '<img src="g5.jpg" />'
      });
      
      loadingWindow.show();
      
      var form = new Ext.form.FormPanel(formBase);
      
      // Nest List For Reports
      // Call Report
      Ext.regModel('Call', {
        fields: [
          {name: 'media_type_id', type: 'int'},
          {name: 'caller_name', type: 'string'},
          {name: 'time_of_day', type: 'string'},
          {name: 'call_status', type: 'string'},
          {name: 'channel', type: 'string'},
          {name: 'tracking_purpose', type: 'string'},
          {name: 'call_start', type: 'date'},
          {name: 'client_name', type: 'string'},
          {name: 'store_name', type: 'string'},
          {name: 'service_id', type: 'int'},
          {name: 'id', type: 'int'},
          {name: 'inboundno', type: 'string'},
          {name: 'forwardno', type: 'string'},
          {name: 'call_end', type: 'date'},
          {name: 'duration', type: 'string'},
          {name: 'caller_number', type: 'string'},
          {name: 'call_id', type: 'string'},
          {name: 'include_in_totals', type: 'bool'}
          ]
      });
      
      callStore = new Ext.data.Store({
        model: 'Call',
        data: []
      });
      
      callView = new Ext.DataView({
        title: 'Calls',
        iconCls: 'favorites',
        store: callStore,
        emptyText   : '<p style="padding: 10px">No calls found matching that search</p>',
        tpl: [
        '<tpl for=".">',
            '<div class="call">',
              '<div class="caller">{caller_name}</div>',
              '<div class="number">{caller_number}</div>',
              '<div class="details">{time_of_day} | {duration}</div>',
            '</div>',
        '</tpl>'
        ].join(''),
        itemSelector: 'div.call',
        singleSelect: true,
        listeners: {
          'activate': function(t){
            Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
            loadCalls();
          },
          'selectionchange': function(v,r){
            var data = v.getSelectedRecords();
            var player = new Ext.Audio({
              autoRender: true,
              floating: true,
              modal: true,
              centered: true,
              hideOnMaskTap: true,
              height: 220,
              width: 220,
              url: 'http://stg.g5search.com/calls/listen/' + data[0].call_id
            });
            player.show();
            return true;
          }
        }
      });
      
      var appList = new Ext.NestedList({
        fullscreen: true,
        title: 'Home',
        xtype: 'nestedlist',
        cls: 'card5',
        iconCls: 'bookmarks',
        fullscreen: true,
        listeners: {
          'activate': function(t){ 
            showHideLogout();
          }
        },
        items: []
      });
      
      var tabpanel = new Ext.TabPanel({
        tabBar: {
          dock: 'bottom',
          layout: {
            pack: 'center'
          }
        },
        fullscreen: true,
        ui: 'dark',
        animation: {
          type: 'slide',
          cover: true
        },
        defaults: {
          scroll: 'vertical'
        },
        items: [appList,callView,logoutTab]
      });
    }
});