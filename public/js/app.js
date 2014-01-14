(function($, bb, io)
{
	var socket = io.connect();
	
	//doc ready
	$(function()
	{
		var Container = bb.View.extend({
			
			el:$('.column'),

			initialize: function() {
				this.$el.sortable({ 
					connectWith: '.column',
          update: function( event, ui ) {
            localStorage.setItem('order', _.pluck($('.column').children(),'id').join(','));
          }
				});
    
    		this.$el.disableSelection();
			 
        //Initialize the order of the widgets
        var order = localStorage.getItem('order');

        if (order) {
          order = order.split(',')

          _.each(order, function(id) {
            $('#' + id).appendTo('.column');
          });
        }
      
      }			
		});

		var CurrentStatusWidget = bb.View.extend({
			el: $('#current-status-widget'),

			events: {
				'click .toggle': 'toggle'
			},

			initialize: function() {
				this.shown = localStorage.getItem('showCurrentStatus') || true;
        
        //localStorage saves everything as strings, so convert to bool
        if (this.shown == "false") {
          this.shown = false;
        }

        this.update();
			},

			toggle: function(ev) {
			  this.shown = !this.shown;
        localStorage.setItem('showCurrentStatus', this.shown);
        this.update();
      },

      update: function() {
        console.log("Update: " + this.shown);
				if (this.shown) {	
					this.$el.find('.portlet-content').css('display', 'block');
					this.$el.find('.toggle').text('Hide Current Status');
				} else {
					this.$el.find('.portlet-content').css('display', 'none');
					this.$el.find('.toggle').text('Show Current Status');
				}
      },
		});

		var ActiveResourcesWidget = bb.View.extend({
			el: $('#active-resources-widget'),

			events: {
				'click .toggle': 'toggle'
			},

			initialize: function() {
				this.shown = localStorage.getItem('showActiveResources') || true;
        
        //localStorage saves everything as strings, so convert to bool
        if (this.shown == "false") {
          this.shown = false;
        }

        this.update();
			},

			toggle: function(ev) {
			  this.shown = !this.shown;
        localStorage.setItem('showActiveResources', this.shown);
        this.update();
      },
			
      update: function() {
				if (this.shown) {	
					this.$el.find('.portlet-content').css('display', 'block');
					this.$el.find('.toggle').text('Hide Active Resources');
					this.$el.resizable({ handles:'s' });
				} else {
					this.$el.find('.portlet-content').css('display', 'none');
					this.$el.find('.toggle').text('Show Active Resources');
					this.$el.css('height','auto');
				
          //This throws an error if it tries to destroy before it's created, just ignore
          try {
            this.$el.resizable('destroy');
          }
          catch(err) {}
				}
      }
		});

		var CallsWaitingWidget = bb.View.extend({
			el: $('#calls-waiting-widget'),

			events: {
				'click .toggle': 'toggle'
			},

			initialize: function() {
				this.shown = localStorage.getItem('showCallsWaiting') || true;
        
        //localStorage saves everything as strings, so convert to bool
        if (this.shown == "false") {
          this.shown = false;
        }

        this.update();
			},

			toggle: function(ev) {
			  this.shown = !this.shown;
        localStorage.setItem('showCallsWaiting', this.shown);
        this.update()
      },

      update: function() {
				if (this.shown) {	
					this.$el.find('.portlet-content').css('display', 'block');
					this.$el.find('.toggle').text('Hide Calls Waiting');
					this.$el.resizable({ handles:'s' });
				} else {
					this.$el.find('.portlet-content').css('display', 'none');
					this.$el.find('.toggle').text('Show Calls Waiting');
					this.$el.css('height','auto');
					
          //Causes error if attempt to destroy before creating, just ignore
          try {
            this.$el.resizable('destroy');
				  } catch (err) {}
        }

      }
		});

		var SummaryStatsWidget = bb.View.extend({
			el: $('#summary-statistics-widget'),

			events: {
				'click .toggle': 'toggle'
			},

			initialize: function() {
				this.shown = localStorage.getItem('showSummaryStats') || true;
        
        //localStorage saves everything as strings, so convert to bool
        if (this.shown == "false") {
          this.shown = false;
        }

        this.update();
			},

			toggle: function(ev) {
			  this.shown = !this.shown;
        localStorage.setItem('showSummaryStats', this.shown);
        this.update();
      },

      update: function() {
				if (this.shown) {	
					this.$el.find('.portlet-content').css('display', 'block');
					this.$el.find('.toggle').text('Hide Summary Stats');
				} else {
					this.$el.find('.portlet-content').css('display', 'none');
					this.$el.find('.toggle').text('Show Summary Stats');
				}
      }
		});

		var UserOptions = bb.View.extend({
			
			el: $('#user-options'),
			
			initialize: function() {
				//Setup the campaigns options
				var campaigns = localStorage.getItem('campaigns');

				if (campaigns) {
					$('#options-campaigns').removeAttr('disabled');					
					$('#options-campaigns').val(campaigns.split(','));
					$('#show-all-campaigns').prop('checked', false);
				} else {
					$('#options-campaigns').attr('disabled','disabled');
					$('#options-campaigns option').prop('selected', true);
					$('#show-all-campaigns').prop('checked',true);

					//init the campaign options
					this.updateCampaignOptions();
				}

				//Setup the user groups options
				var groups = localStorage.getItem('groups');

				if (groups) {
					$('#options-groups').removeAttr('disabled');					
					$('#options-groups').val(groups.split(','));
					$('#show-all-groups').prop('checked', false);
				} else {
					$('#options-groups').attr('disabled','disabled');
					$('#options-groups option').prop('selected', true);
					$('#show-all-groups').prop('checked',true);

					//init the group options
					this.updateGroupOptions();
				}

        //Setup display options
        var display = localStorage.getItem('display');

        if (display) {
          $('#options-display').val(display);  
        }

        //init the display options
        this.updateDisplayOptions();
			},

			events: {
				'click #options-campaigns' : 'updateCampaignOptions',
				'click #options-groups' : 'updateGroupOptions',
				'click #show-all-campaigns' : 'showAllCampaigns',
				'click #show-all-groups' : 'showAllUserGroups',
			  'change #options-display' : 'updateDisplayOptions'
      },
      
      updateDisplayOptions: function(ev) {
        var display = $('#options-display').val();
        
        if (display) {
          localStorage.setItem('display', display);
          $('body').removeClass().addClass(display);
        } else {
          //Set default value for display
          localStorage.setItem('display', 'Normal');
        }
      },

			updateCampaignOptions: function(ev) {
				var campaigns = $('#options-campaigns').val();

				if (campaigns) {
					localStorage.setItem('campaigns', campaigns.join(','));
				} else {
					//Null means show all campaigns
					localStorage.setItem('campaigns','');
				}
			}, 

			updateGroupOptions: function(ev) {
				var groups = $('#options-groups').val();
				
				if (groups) {
					localStorage.setItem('groups', groups.join(','));
				} else {
					//Null means show all groups
					localStorage.setItem('groups', '');
				}
			},

			showAllCampaigns: function(ev) {
				if($('#show-all-campaigns').prop('checked')) {
					$('#options-campaigns').attr('disabled', 'disabled');
					$('#options-campaigns option').prop('selected', true);
				} else {
					$('#options-campaigns').removeAttr('disabled');
				}

				//reload the campaign options
				this.updateCampaignOptions(ev);
			},

			showAllUserGroups: function(ev) {
				if($('#show-all-groups').prop('checked')) {
					$('#options-groups').attr('disabled', 'disabled');
					$('#options-groups option').prop('selected', true);	
				} else {
					$('#options-groups').removeAttr('disabled');
				}

				//reload the group options
				this.updateGroupOptions(ev);
			}
		});
		
		
		
		/**
		 * Calls Waiting
		 */
		var Call = bb.Model.extend({});
		var CallCollection = bb.Collection.extend({});
		var CallView = bb.View.extend({
			
			tagName: 'tr',
			template: _.template($('#call-template').html()),
			
			events: {
				
			},
			
			initialize: function()
			{
				this.callsTable = $('#callsTable');

				this.listenTo(this.model, 'change', this.change);
				this.listenTo(this.model, 'add', this.render);
				this.listenTo(this.model, 'remove', this.remove);
			
				this.updateTable = _.debounce(function() {
					this.callsTable.trigger('update');
				}, 1000);

				this.sortTable = _.debounce(function() {
					this.callsTable.find('thead th:eq(2)').trigger('sort');
				}, 2000);

			},

			render: function()
			{
				if( this.model.get('status') !== 'XFER')
				{
					this.remove();
					return;
				}
				
				//grab the options	
				var campaigns = localStorage.getItem('campaigns');
				
				if (campaigns) {
					if ((campaigns != '-ALL-CAMPAIGNS-') && (campaigns.split(',').indexOf(this.model.get('campaign')) === -1)) {
						return;
					}
				}

				this.$el.html(this.template(this.model.toJSON()));
				this.callsTable.append( this.$el );
				
				//Update the table and sort on the time on hold column
				this.updateTable();
				this.sortTable();

				$('[title]').tooltip();
				
				return this;
			},

			change: function()
			{
				if (!this.$el) return;

				this.$el.html(this.template(this.model.toJSON()));
				return this;
			},
			
			remove: function()
			{
				if(!this.$el) return;
				
				this.$el.remove();
				this.el = null;
				this.$el = null;
			}

		});


		/**
		 * Active Resources
		 */
		var User = bb.Model.extend({});
		var UsersCollection = bb.Collection.extend({});
		var UserView = bb.View.extend({

			tagName: 'tr',
			
			template: _.template($('#resource-template').html()),
			
			events: {
				'click [data-monitor]' : 'monitor',
				'click [data-coach]'   : 'coach',
				'click [data-barge]'   : 'barge'
			},
			
			initialize: function()
			{
				this.usersTable = $('#resourcesTable');
					
				this.listenTo(this.model, 'change', this.change);
				this.listenTo(this.model, 'remove', this.remove);

				this.updateTable = _.debounce(function() {
					this.usersTable.trigger('update');
				}, 1000);
			},

			render: function()
			{	
				//grab the options	
				var groups = localStorage.getItem('groups');
				var campaigns = localStorage.getItem('campaigns');

				//check if user belongs to the filtered campaigns
				if (campaigns) {
					if ((campaigns != '-ALL-CAMPAIGNS-') && (campaigns.split(',').indexOf(this.model.get('campaign')) === -1)) {
						return;
					}
				} 

				//check if the user belongs to the filtered groups
				if (groups) {
					if (groups.split(',').indexOf(this.model.get('group')) === -1) {
						return;
					}
				} 

				var attrs = this.model.toJSON();
				attrs.time = this.formatTime(attrs.time);

				this.$el.html( this.template(attrs) );

				this.usersTable.append( this.$el );
			
				//Update the table for sorting
				this.updateTable();

				$('[title]').tooltip();

				return this;
			},

			formatTime: function(time)
			{
				var 
					hours = 0,
					mins = time / 60,
					secs = time % 60
				;

				if(mins > 60)
				{
					hours = mins / 60;
					mins = mins % 60;
					secs = mins % 60;
				}

				return this.leadingZero(hours.toFixed(0), 2) + ':' + this.leadingZero(mins.toFixed(0), 2) + ':' + this.leadingZero(secs.toFixed(0), 2);
			},

			leadingZero: function(num, size)
			{
				if(typeof(size) !== "number"){size = 2;}

				var s = String(num);
				while (s.length < size) s = "0" + s;
				
				return s;
			},

			change: function()
			{
				var attrs = this.model.toJSON();
				attrs.time = this.formatTime(attrs.time);

				this.$el.html( this.template(attrs) );
				
				//Update the table for sorting
				this.updateTable();
				
				return this;
			},

			remove: function()
			{
				this.$el.remove();
			},

			monitor: function()
			{
				var
					data = $('.btn-group', this.$el).data(),
					attr = {
						'session_id': data.sessionId,
						'server_ip': data.serverIp,
						'extension': data.extension
					}
				;
				
				socket.emit(
					'monitor', attr, function(res)
					{
						console.log(res);
					}
				);
			},

			coach: function()
			{
				var
					data = $('.btn-group', this.$el).data(),
					attr = {
						'session_id': data.sessionId,
						'server_ip': data.serverIp,
						'extension': data.extension
					}
				;
				
				socket.emit(
					'coach', attr, function(res)
					{
						console.log(res);
					}
				);
			},

			barge: function()
			{
				var
					data = $('.btn-group', this.$el).data(),
					attr = {
						'session_id': data.sessionId,
						'server_ip': data.serverIp,
						'extension': data.extension
					}
				;
				
				socket.emit(
					'barge', attr, function(res)
					{
						console.log(res);
					}
				);
			}

		});


		/**
		 * Application
		 */
		var AppView = bb.View.extend({

			/**
			 * Initialization Function
			 *
			 * register our socket listeners
			 */
			initialize: function()
			{
				var self = this;

				this.calls = new CallCollection();
				this.users = new UsersCollection();
				this.userOptions = new UserOptions();	
				this.callsWaitingWidget = new CallsWaitingWidget();
				this.summaryStatsWidget = new SummaryStatsWidget();
				this.currentStatusWidget = new CurrentStatusWidget();
				this.activeResourcesWidget = new ActiveResourcesWidget();
				this.container = new Container();

				//Add sorting to the tables
				$('#resourcesTable').tablesorter({ 
					theme: 'bootstrap', 
				});

				$('#callsTable').tablesorter({
					theme: 'bootstrap', 
				});


				socket.emit('client.ready', function(data)
				{
					self.renderStats(data.stats);
          self.calls.add(data.calls);
					self.users.add(data.users);
					self.renderStatus();
				});

				socket.on('stats.changed', function(stats)
				{
					self.renderStats(stats);
          self.renderStatus();
				});


				socket.on('users.add', function(user)
				{
					self.users.add(user, { merge: true });
				});

				socket.on('users.remove', function(user)
				{
					self.users.remove(user);
				});

				socket.on('users.change', function(user)
				{
					self.users.add(user, { merge: true });
				});


				socket.on('calls.add', function(call)
				{
					self.calls.add(call, { merge: true });
				});

				socket.on('calls.remove', function(call)
				{
					self.calls.remove(call);
				});
				
				socket.on('calls.change', function(call)
				{
					self.calls.add(call, { merge: true });
				});
			

				socket.on('reconnecting', function(elapsed,attempts)
				{
					if(attempts > 3)
					{
						location.reload();
					}
				});


				this.listenTo(this.users, 'add', function(model)
				{
					var view = new UserView({ model: model });
					view.render();
				});

				this.listenTo(this.calls, 'add', function(model)
				{
					var view = new CallView({ model: model });
					view.render();
				});
			},
		  
      renderStatus: function() {
        console.log('calls: \n' + JSON.stringify(this.calls));    
        console.log('agents: \n' + JSON.stringify(this.users));    
      
				//grab the options	
				var groups = localStorage.getItem('groups');
				var campaigns = localStorage.getItem('campaigns');

        //Agent Counters
        var agentsLoggedIn = 0;
        var agentsWaiting = 0;
        var agentsPaused = 0;
        var agentsInCalls = 0;
        var agentsInDispo = 0;
        var agentsInDeadCalls = 0;

        for (var i=0;i<this.users.length;i++) {
          if ((inGroup(this.users.at(i).get('group'))) && (inCampaign(this.users.at(i).get('campaign')))) {
            agentsLoggedIn++;
          
            var status = this.users.at(i).get('status');
            
            if (status === 'READY') {
              agentsWaiting++;
            } else if (status === 'PAUSED') {
              agentsPaused++;
            } else if (status === 'INCALL') {
              agentsInCalls++;
            }
            
            if (status === 'READY' || status === 'PAUSED') {
              if (this.users.at(i).get('lead_id') > 0) {
                agentsInDispo++;
              }
            }

            var callerId = this.users.at(i).get('callerid');

            if (callerId) {
              var call = this.calls.findWhere({ callerid: callerId });
              
              if (!call) {
                agentsInDeadCalls++;
              }
            }
          }
        }
        
        console.log('Agents Logged In: ' + agentsLoggedIn);
        console.log('Agents Waiting: ' + agentsWaiting);
        console.log('Agents Paused: ' + agentsPaused);
        console.log('Agents in Calls: ' + agentsInCalls);
        console.log('Agents in Dispo: ' + agentsInDispo);
        console.log('Agents in Dead calls: ' + agentsInDeadCalls);

        
        //Call Counters
        var callsRinging = 0;
        var callsActive = 0;
        var callsWaiting = 0;

        for (var i=0;i<this.calls.length;i++) {
          if (inCampaign(this.calls.at(i).get('campaign'))) {
            callsActive++;
          
            var status = this.calls.at(i).get('status');
            
            if (status === 'SENT') {
              callsRinging++;
            } else if (status === 'XFER') {
              callsWaiting++;
            }
          }
        }
        
        console.log('Calls Active: ' + callsActive);
        console.log('Calls Ringing: ' + callsRinging);
        console.log('Calls Waiting: ' + callsWaiting);


        function inGroup(group) {
          //check if the model belongs to the filtered groups
          if (groups) {
            if (groups.split(',').indexOf(group) === -1) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      
        function inCampaign(campaign) {
          //check if model belongs to the filtered campaigns
          if (campaigns) {
            if ((campaigns != '-ALL-CAMPAIGNS-') && (campaigns.split(',').indexOf(campaign) === -1)) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      },

			renderStats: function(stats)
			{
				for(var key in stats)
				{
					var $el = $('[data-stat="' + key + '"]');
					if($el.length)
					{
						$el.text(stats[key]);
					}
				}

				if(stats['dropped'] == stats['prev_dropped'])
				{
					// $('[data-stat="dropped_running_tally"]').html('<i class="icon-arrow-right text-warning"></i>');
					$('[data-stat="dropped_running_tally"]').html('');
					$('[data-stat="dropped_delta"]').html('<span class="text-warning">+- 0</span>');
					$('[data-stat="dropped_pct"]').parent().removeClass('text-success text-danger').addClass('text-warning');
				}
				else if(stats['dropped'] > stats['prev_dropped'])
				{
					$('[data-stat="dropped_running_tally"]').html('<i class="icon-arrow-up text-danger"></i>');
					$('[data-stat="dropped_delta"]').html( '<span class="text-danger">+' + (stats['dropped_pct'] - stats['prev_dropped']) + '</span>' );
					$('[data-stat="dropped_pct"]').parent().removeClass('text-success text-warning').addClass('text-danger');
				}
				else
				{
					$('[data-stat="dropped_running_tally"]').html('<i class="icon-arrow-down text-success"></i>');
					$('[data-stat="dropped_delta"]').html( '<span class="text-success">-' + (stats['prev_dropped'] - stats['dropped_pct']) + '</span>' );
					$('[data-stat="dropped_pct"]').parent().removeClass('text-warning text-danger').addClass('text-success');
				}
			}

		});
		var App = new AppView;

		$('[title]').tooltip();
	
		var curr = 0;
		$('[data-toggle="phone"]').on('click', function(e)
		{
			e.preventDefault();

			var h = (curr === 330)
				? 0
				: 330;

			curr = h;

			$('#webphone').height(curr);
		});
	});
}(jQuery, Backbone, io));
