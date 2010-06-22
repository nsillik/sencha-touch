Ext.ns('geefive');
Ext.setup({
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function() {
      // Google Charts
      // Login Form
      var user = {id: 0};
      var client_id = 1001;
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
          url: '/mobile/login',
          params: data,
          success: function(response,opts){
            var r = Ext.decode(response.responseText);
            user = r.user;
            b.setText('Login');
            if(r.user.id == 0){
              form.show();
              form.setValues({login: 'Invalid Login', password: ''});
            }else{
              Ext.getBody().unmask();
              showHideLogout();
              form.hide();
            }
          }
        })
      };
      
      // Get geefive client center status
      var checkClientCenterLogin = function() {
        Ext.Ajax.request({
          url: '/mobile/user',
          success: function(response, opts) {
            var r = Ext.decode(response.responseText);
            user = r.user;
            if(r.user.id == 0){
              form.show();
            }else{
              showHideLogout();
              Ext.getBody().unmask();
              form.hide();
            }
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
            Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
            user = {id: 0};
            Ext.Ajax.request({
              url: '/user/logout',
              success: function(){
                Ext.getBody().unmask();
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
      

      Ext.apply(formBase, {
        autoRender: true,
        floating: true,
        modal: true,
        centered: true,
        hideOnMaskTap: false,
        height: 285,
        width: 340
      });
      
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
      
      //loadingWindow.show();
      
      Ext.getBody().mask(false, '<div class="demos-loading">Loading&hellip;</div>');
      var form = new Ext.form.FormPanel(formBase);
      
      var callView = new geefive.callReport();
      
      var homeScreen = new Ext.Panel({
        fullscreen: true,
        title: 'Home',
        text: 'Home',
        cls: 'splash',
        iconCls: 'favorites',
        html: '<p><img src="g5.jpg" /></p><p><em>This is only a test of the geefive skunkwerks system.</em></p>'
      });
      
      var reportList = new Ext.NestedList({
        fullscreen: true,
        title: 'Reports',
        text: 'Reports',
        xtype: 'nestedlist',
        cls: 'card5',
        iconCls: 'settings',
        fullscreen: true,
        listeners: {
          'activate': function(t){ 
            showHideLogout();
          }
        },
        items: [{
          text: 'Leads Graphs',
          items: [{
            text: 'Week To Date',
            handler: function(){
              var graph = new geefive.leadGraph({
                client_id: client_id,
                title: "This Week's Leads",
                range: 'week'
              });
              graph.loadGraphData();
            }
          },{
            text: 'Month To Date',
            handler: function(){
              var graph = new geefive.leadGraph({
                client_id: client_id,
                title: "This Month's Leads",
                range: 'month'
              });
              graph.loadGraphData();
            }
          },{
            text: 'Year To Date',
            handler: function(){
              var graph = new geefive.leadGraph({
                client_id: client_id,
                title: "This Year's Leads",
                range: 'year'
              });
              graph.loadGraphData();
            }
          }]
        }]
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
        items: [homeScreen,reportList,callView,logoutTab]
      });
    }
});
