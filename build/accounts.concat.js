(function() {
  var Q, root, _ref;

  root = this;

  Q = root.Q != null ? root.Q : root.Q = {};

  Q.paths = {
    base: location.host + '/qoffice/',
    initPaths: function() {
      var s, segments;
      this.baseit = location.host + 'it/qoffice/';
      this.sortStampaquoteSports = this.base + 'api/rest/sortFrontendSports';
      s = location.href.substring(this.baseit.length - 1);
      segments = location.pathname.substring(1).split('/');
      this.realm = segments[1] || (segments[1] = '');
      this.model = segments[2] || (segments[2] = '');
      this.currentpage = segments[3] || (segments[3] = '');
      this.assets = '/bundles/qoffice/images/';
      delete this.initPaths;
      return this;
    }
  }.initPaths();

  modulejs.define('Q', function() {
    return Q;
  });

  modulejs.define('jquery', function() {
    return jQuery;
  });

  modulejs.define('Backbone', function() {
    return Backbone;
  });

  modulejs.define('_', function() {
    return _;
  });

  Backbone.View.prototype.close = function() {
    this.remove();
    this.unbind();
    if (this.onClose) {
      return this.onClose();
    }
  };

  this;

  modulejs.define('ModelAccounts', ['Backbone'], function(Backbone) {
    var ModelAccounts;
    return ModelAccounts = Backbone.Model.extend({
      idAttribute: "uid",
      defaults: {
        'qid': '',
        'nome': '',
        'cognome': '',
        'datacreazione': '',
        'accounts': {
          'ragione': ''
        },
        'callcenter': [],
        'indirizzo': '',
        'comune': '',
        'provincia': '',
        'regione': '',
        'paese': '',
        'status': '',
        'profilo': '',
        'stato': '',
        'telefono': '',
        'uid': '',
        'padre': {
          'idutente': '',
          'uid': ''
        },
        'latlng': {
          'idref': '',
          'lat': '',
          'lng': ''
        },
        'active': false,
        'visibleInMaps': true
      }
    });
  });

  modulejs.define('ModelFoglinotizia', ['Backbone'], function(Backbone) {
    var ModelFoglinotizia;
    return ModelFoglinotizia = Backbone.Model.extend({
      defaults: {
        'id': "",
        'master': "",
        'ragione': "",
        'nome': "",
        'cognome': "",
        'indirizzo': '',
        'comune': '',
        'provincia': '',
        'regione': '',
        'paese': '',
        'status': '',
        'created_at': '',
        'apertura': '',
        'email': '',
        'telefono': '',
        'note': '',
        'lat': '',
        'lng': '',
        'active': false
      }
    });
  });

  modulejs.define('CollectionAccounts', ['Q', 'Backbone', 'ModelAccounts'], function(Q, Backbone, ModelAccounts) {
    var CollectionAccounts;
    return CollectionAccounts = Backbone.Collection.extend({
      model: ModelAccounts,
      url: location.origin + "/qoffice/api/accounts/lista/" + Q.paths.currentpage,
      initialize: function() {
        this.fetch({
          reset: true
        });
      }
    });
  });

  modulejs.define('CollectionFoglinotizia', ['Q', 'Backbone', 'ModelFoglinotizia'], function(Q, Backbone, ModelFoglinotizia) {
    var CollectionFoglinotizia;
    return CollectionFoglinotizia = Backbone.Collection.extend({
      model: ModelFoglinotizia,
      url: location.origin + "/qoffice/api/accounts/lista/" + Q.paths.currentpage,
      initialize: function() {
        this.fetch({
          reset: true
        });
      }
    });
  });

  modulejs.define('ViewPartialsFactory', ['Q', 'jquery', 'Backbone'], function(Q, $, Backbone) {
    var ViewPartialsFactory;
    return ViewPartialsFactory = Backbone.View.extend({
      init: function(render) {
        if (render == null) {
          render = false;
        }
        _.bindAll(this, 'render');
        this.ajaxUrl = this.setAjaxUrl();
        this.loaded = render;
        this.tempModel = this.options.model.clone();
        this.appendMenuItem();
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id;
      },
      appendMenuItem: function() {
        var li, liFrag,
          _this = this;
        liFrag = document.createDocumentFragment();
        li = document.createElement("li");
        li.className = 'accounts-partials-' + this.options.name + '-menutab ' + (this.loaded ? 'active' : void 0);
        li.innerHTML = '<a href="#tab-' + this.options.name + '-' + this.model.get("uid") + '" data-toggle="tab"></span> <i class="fontello-icon-accounts-' + this.options.name + '"></i> ' + this.options.name + '</a>';
        liFrag.appendChild(li);
        this.options.mainView.find('.nav-tabs').append(liFrag);
        this.options.mainView.delegate('.accounts-partials-' + this.options.name + '-menutab', 'click', function(el) {
          if (!$(el.currentTarget).hasClass('active') && !_this.loaded) {
            _this.loaded = true;
            return _this.fetchData();
          }
        });
        if (this.loaded) {
          return this.fetchData();
        }
      },
      fetchData: function() {
        var me;
        me = this;
        $.ajax({
          url: this.ajaxUrl,
          async: false,
          success: function(data) {
            me.$el.detach();
            return me.appendTo(JSON.parse(data));
          }
        });
      },
      appendTo: function(data) {
        this.options.mainView.find('.tab-content').append(data.tab);
        this.createTemplate();
      },
      createTemplate: function(mainView) {
        this.$el = this.options.mainView.find('#tab-' + this.options.name + '-' + this.options.model.id);
        this.$el.addClass(this.loaded ? 'active' : '');
        this.templateTab = _.template(this.$el.find(".template-tab-" + this.options.name).html());
        this.render();
        this.delegateEvents();
      }
    });
  });

  modulejs.define('ViewPartialsAssegni', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsAssegni;
    return ViewPartialsAssegni = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id + '/' + Q.paths.currentpage;
      },
      render: function() {
        var me;
        me = this;
        this.$el.children('div').html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        this.$el.find('.fileupload').each(function() {
          return $(this).fileupload({
            maxFileSize: 3145728,
            limitMultiFileUploads: 5,
            acceptFileTypes: /(\.|\/)(pdf|docx|doc|rtf|txt|gif|jpe?g|png)$/i,
            submit: function(e, data) {
              me.loaded = false;
            }
          });
        });
        this.$el.on('click', '.accounts-elimina-file', function(e) {
          e.preventDefault();
          if (!confirm('Sei sicuro?')) {
            return false;
          }
          $(e.currentTarget).parents('li').detach();
          return $.ajax({
            url: $(e.currentTarget).attr('href'),
            type: 'DELETE',
            success: function(result) {}
          });
        });
        return this;
      }
    });
  });

  modulejs.define('ViewPartialsCallcenter', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsCallcenter;
    return ViewPartialsCallcenter = ViewPartialsFactory.extend({
      events: {
        "click .openModal": "openModal"
      },
      initialize: function() {
        return this.init(this.options.active);
      },
      render: function() {
        this.$el.html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        this.renderDataTable();
      },
      renderDataTable: function() {
        this.table = this.$el.find('#datatable-account-' + this.options.model.get('idutente') + '-callcenter').dataTable({
          aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          iDisplayLength: 20,
          aaData: this.model.toJSON().callcenter,
          bDeferRender: true,
          bRetrieve: true,
          bIgnoreEmpty: false,
          oColumnFilterWidgets: {
            "aiExclude": [0]
          },
          aoColumns: (function() {
            var aNewData;
            aNewData = [
              {
                'mData': function(data, objs) {
                  return '<a class="btn btn-mini btn-yellow openModal" data-toggle="modal" rel="' + data.id + '-' + data.idutente + '" href="#' + data.id + '"><i class="fontello-icon-accounts-callcenter"></i>modifica</a>';
                }
              }, {
                'mData': function(data) {
                  return data.dataora;
                }
              }, {
                'mData': function(data) {
                  return data.user.username;
                }
              }, {
                'mData': function(data) {
                  var label, txt;
                  if (!data.esito) {
                    label = 'warning';
                    txt = 'manca esito';
                  } else {
                    txt = data.esito;
                    if (data.esito === 'Positivo') {
                      label = "success";
                    } else {
                      label = "important";
                    }
                  }
                  return "<span class='label label-" + label + "' />" + txt + '</span>';
                }
              }, {
                'mData': function(data) {
                  if (data.descrizione) {
                    return data.descrizione;
                  } else {
                    return '';
                  }
                }
              }
            ];
            return aNewData;
          })(),
          oLanguage: {
            sInfoEmpty: "0 record trovati",
            sInfoFiltered: "(filtrati su un totale di _MAX_)",
            sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali",
            sSearch: "Global search: ",
            sLengthMenu: "Mostra _MENU_ risultati",
            sZeroRecords: 'Nessun record trovato'
          },
          bSortCellsTop: true,
          aaSorting: [[1, 'desc']],
          sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"
        }).columnFilter({
          sPlaceHolder: 'head:after'
        });
      },
      openModal: function(e) {
        var me, target;
        me = this;
        target = this.$el.find('.ajaxModalTarget');
        $('.ajaxModalTarget').empty();
        $('body').modalmanager('loading');
        target.load(Q.Accounts.paths.api + this.options.name + '/' + $(e.currentTarget).attr('rel'), '', function(e) {
          target.modal().css({
            'margin-top': '0px'
          });
          $('body').delegate('.ajaxModalSave', 'click', function(e) {
            return me.saveDataFromModal(e);
          });
        });
      },
      saveDataFromModal: function(e) {
        var me, target;
        $('body').undelegate('.ajaxModalSave', 'click');
        me = this;
        target = $(e.currentTarget).parents('.ajaxModalTarget');
        target.modal('loading');
        setTimeout(function() {
          $.ajax({
            url: Q.Accounts.paths.api + me.options.name,
            type: 'POST',
            data: target.find('form').serialize(),
            success: function(ev) {
              var d;
              d = JSON.parse(ev).saved;
              if (d) {
                $(e.currentTarget).siblings('.close').click();
                me.addOrModifyItem(d);
              }
            }
          });
        }, 100);
      },
      addOrModifyItem: function(d) {
        var currentSet, updated;
        currentSet = this.options.model.get(this.options.name);
        updated = _.reject(currentSet, function(item) {
          return item.id === d.id;
        });
        updated.push(d);
        this.options.model.set(this.options.name, updated);
        return this.refreshTable();
      },
      refreshTable: function() {
        var sett;
        sett = this.table.fnSettings();
        sett.aaData = this.options.model.attributes.callcenter;
        this.table.fnReloadAjax(sett);
      }
    });
  });

  modulejs.define('ViewPartialsDocumenti', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsDocumenti;
    return ViewPartialsDocumenti = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id + '/' + Q.paths.currentpage;
      },
      render: function() {
        var me;
        me = this;
        this.$el.children('div').html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        this.$el.find('.fileupload').each(function() {
          return $(this).fileupload({
            maxFileSize: 2000000,
            limitMultiFileUploads: 5,
            acceptFileTypes: /(\.|\/)(pdf|docx|doc|rtf|txt|gif|jpe?g|png)$/i,
            submit: function(e, data) {
              me.loaded = false;
              return true;
            }
          });
        });
        this.$el.on('click', '.accounts-elimina-file', function(e) {
          e.preventDefault();
          if (!confirm('Sei sicuro?')) {
            return false;
          }
          $(e.currentTarget).parents('li').detach();
          return $.ajax({
            url: $(e.currentTarget).attr('href'),
            type: 'DELETE',
            success: function(result) {}
          });
        });
        return this;
      }
    });
  });

  modulejs.define('ViewPartialsGallery', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsGallery;
    return ViewPartialsGallery = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id + '/' + Q.paths.currentpage;
      },
      render: function() {
        var me;
        me = this;
        this.$el.children('div').html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        this.$el.find('.fileupload').each(function() {
          return $(this).fileupload({
            maxFileSize: 3145728,
            limitMultiFileUploads: 5,
            acceptFileTypes: /(\.|\/)(pdf|docx|doc|rtf|txt|gif|jpe?g|png)$/i,
            submit: function(e, data) {
              me.loaded = false;
            }
          });
        });
        this.$el.on('click', '.accounts-elimina-file', function(e) {
          e.preventDefault();
          if (!confirm('Sei sicuro?')) {
            return false;
          }
          $(e.currentTarget).parents('li').detach();
          return $.ajax({
            url: $(e.currentTarget).attr('href'),
            type: 'DELETE',
            success: function(result) {}
          });
        });
        return this;
      }
    });
  });

  modulejs.define('ViewPartialsIsolutions', ['Q', 'ViewPartialsFactory'], function(Q, ViewPartialsFactory) {
    var ViewPartialsIsolutions;
    return ViewPartialsIsolutions = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id + '/' + Q.paths.currentpage;
      },
      render: function() {
        this.$el.html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        return this;
      }
    });
  });

  modulejs.define('ViewPartialsQpoints', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsQpoints;
    return ViewPartialsQpoints = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      events: {
        "click .openModal": "openModal"
      },
      render: function() {
        this.$el.html(this.templateTab({
          'account': this.options.model.toJSON(),
          'lastMovement': this.options.model.get('qpoints')[0]
        }));
        this.renderDataTable();
      },
      renderDataTable: function() {
        return this.table = this.$el.find('#datatable-account-' + this.options.model.get('idutente') + '-qpoints').dataTable({
          aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          iDisplayLength: 20,
          aaData: this.model.toJSON().qpoints,
          bDeferRender: true,
          bRetrieve: true,
          bIgnoreEmpty: false,
          oColumnFilterWidgets: {
            "aiExclude": [0]
          },
          aoColumns: (function() {
            var aNewData;
            aNewData = [
              {
                'mData': function(data, objs) {
                  return '<a class="btn btn-mini btn-yellow openModal" data-toggle="modal" rel="' + data.idtransazione + '-' + data.idutente + '" href="#' + data.idtransazione + '"><i class="fontello-icon-accounts-qpoints"></i>modifica</a>';
                }
              }, {
                'mData': function(data) {
                  return data.dataora;
                }
              }, {
                'mData': function(data) {
                  return data.operatore.username;
                }
              }, {
                'mData': function(data) {
                  var label, txt;
                  if (!data.causali) {
                    label = 'important';
                    txt = 'manca causale';
                  } else {
                    txt = data.causali.descrizione;
                    if (data.causali.idcausale === '2') {
                      label = "success";
                    } else {
                      label = "info";
                    }
                  }
                  return "<span class='label label-" + label + "' />" + txt + '</span>';
                }
              }, {
                'mData': function(data) {
                  return data.movimenti;
                }
              }, {
                'mData': function(data) {
                  return data.saldo;
                }
              }, {
                'mData': function(data) {
                  if (data.descrizione) {
                    return data.descrizione;
                  } else {
                    return '';
                  }
                }
              }
            ];
            return aNewData;
          })(),
          oLanguage: {
            sInfoEmpty: "0 record trovati",
            sInfoFiltered: "(filtrati su un totale di _MAX_)",
            sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali",
            sSearch: "Global search: ",
            sLengthMenu: "Mostra _MENU_ risultati",
            sZeroRecords: 'Nessun record trovato'
          },
          bSortCellsTop: true,
          aaSorting: [[1, 'desc']],
          sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"
        }).columnFilter({
          sPlaceHolder: 'head:after'
        });
      },
      openModal: function(e) {
        var me, target;
        me = this;
        target = this.$el.find('.ajaxModalTarget');
        $('.ajaxModalTarget').empty();
        $('body').modalmanager('loading');
        target.load(Q.Accounts.paths.api + this.options.name + '/' + $(e.currentTarget).attr('rel'), '', function(e) {
          target.modal().css({
            'margin-top': '0px'
          });
          $('body').delegate('.ajaxModalSave', 'click', function(e) {
            return me.saveDataFromModal(e);
          });
        });
      },
      saveDataFromModal: function(e) {
        var me, target;
        $('body').undelegate('.ajaxModalSave', 'click');
        me = this;
        target = $(e.currentTarget).parents('.ajaxModalTarget');
        target.modal('loading');
        setTimeout(function() {
          $.ajax({
            url: Q.Accounts.paths.api + me.options.name,
            type: 'POST',
            data: target.find('form').serialize(),
            success: function(ev) {
              var d;
              d = JSON.parse(ev).saved;
              if (d) {
                $(e.currentTarget).siblings('.close').click();
                me.addOrModifyItem(d);
              }
            }
          });
        }, 100);
      },
      addOrModifyItem: function(d) {
        var currentSet, exists, updated;
        currentSet = this.options.model.get(this.options.name);
        updated = _.reject(currentSet, function(item, index, ctx) {
          return item.idtransazione === d.idtransazione;
        });
        exists = currentSet.length > updated.length;
        updated.push(d);
        this.options.model.set(this.options.name, updated);
        if (!exists) {
          this.updateUIAttuali(d);
        }
        return this.refreshTable();
      },
      refreshTable: function() {
        var sett;
        sett = this.table.fnSettings();
        sett.aaData = this.options.model.attributes[this.options.name];
        this.table.fnReloadAjax(sett);
      },
      updateUIAttuali: function(d) {
        var movement, positiveSign, target;
        positiveSign = d.movimenti > 0;
        target = this.$el.find('.statistic-values');
        target.find('span.balance').html(d.saldo);
        movement = this.$el.find('.movement');
        movement.removeClass('positive negative').addClass('movement ' + (positiveSign ? 'positive' : 'negative'));
        movement.find('.indicator').removeClass('fontello-icon-up-dir fontello-icon-down-dir').addClass(positiveSign ? 'fontello-icon-up-dir' : 'fontello-icon-down-dir');
        movement.find('sup').html(d.movimenti);
      }
    });
  });

  modulejs.define('ViewPartialsQshop', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsQshop;
    return ViewPartialsQshop = ViewPartialsFactory.extend({
      initialize: function() {
        return this.init(this.options.active);
      },
      events: {
        "click .openModal": "openModal"
      },
      render: function() {
        this.$el.html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        this.renderDataTable();
      },
      renderDataTable: function() {
        return this.table = this.$el.find('#datatable-account-' + this.options.model.get('idutente') + '-qshop').dataTable({
          aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          iDisplayLength: 20,
          aaData: this.model.toJSON().qshop,
          bDeferRender: true,
          bRetrieve: true,
          bIgnoreEmpty: false,
          oColumnFilterWidgets: {
            "aiExclude": [0]
          },
          aoColumns: (function() {
            var aNewData;
            aNewData = [
              {
                'mData': function(data, objs) {
                  return '<a class="btn btn-mini btn-yellow openModal" data-toggle="modal" rel="' + data.idtransazione + '-' + data.idutente + '" href="#' + data.idtransazione + '"><i class="fontello-icon-accounts-qshop"></i>modifica</a>';
                }
              }, {
                'mData': function(data) {
                  return data.dataora;
                }
              }, {
                'mData': function(data) {
                  return data.operatore.username;
                }
              }, {
                'mData': function(data) {
                  var label, txt;
                  if (!data.causali) {
                    label = 'important';
                    txt = 'manca causale';
                  } else {
                    txt = data.causali.descrizione;
                    if (data.causali.idcausale === '2') {
                      label = "success";
                    } else {
                      label = "info";
                    }
                  }
                  return "<span class='label label-" + label + "' />" + txt + '</span>';
                }
              }, {
                'mData': function(data) {
                  return data.movimenti;
                }
              }, {
                'mData': function(data) {
                  return data.saldo;
                }
              }, {
                'mData': function(data) {
                  if (data.descrizione) {
                    return data.descrizione;
                  } else {
                    return '';
                  }
                }
              }
            ];
            return aNewData;
          })(),
          oLanguage: {
            sInfoEmpty: "0 record trovati",
            sInfoFiltered: "(filtrati su un totale di _MAX_)",
            sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali",
            sSearch: "Global search: ",
            sLengthMenu: "Mostra _MENU_ risultati",
            sZeroRecords: 'Nessun record trovato'
          },
          bSortCellsTop: true,
          aaSorting: [[1, 'desc']],
          sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"
        }).columnFilter({
          sPlaceHolder: 'head:after'
        });
      },
      openModal: function(e) {
        var me, target;
        me = this;
        target = this.$el.find('.ajaxModalTarget');
        $('.ajaxModalTarget').empty();
        $('body').modalmanager('loading');
        target.load(Q.Accounts.paths.api + this.options.name + '/' + $(e.currentTarget).attr('rel'), '', function(e) {
          target.modal().css({
            'margin-top': '0px'
          });
          $('body').delegate('.ajaxModalSave', 'click', function(e) {
            return me.saveDataFromModal(e);
          });
        });
      },
      saveDataFromModal: function(e) {
        var me, target;
        $('body').undelegate('.ajaxModalSave', 'click');
        me = this;
        target = $(e.currentTarget).parents('.ajaxModalTarget');
        target.modal('loading');
        setTimeout(function() {
          $.ajax({
            url: Q.Accounts.paths.api + me.options.name,
            type: 'POST',
            data: target.find('form').serialize(),
            success: function(ev) {
              var d;
              d = JSON.parse(ev).saved;
              if (d) {
                $(e.currentTarget).siblings('.close').click();
                me.addOrModifyItem(d);
              }
            }
          });
        }, 100);
      },
      addOrModifyItem: function(d) {
        var currentSet, exists, updated;
        currentSet = this.options.model.get(this.options.name);
        updated = _.reject(currentSet, function(item, index, ctx) {
          return item.idtransazione === d.idtransazione;
        });
        exists = currentSet.length > updated.length;
        updated.push(d);
        this.options.model.set(this.options.name, updated);
        if (!exists) {
          this.updateUIAttuali(d);
        }
        return this.refreshTable();
      },
      refreshTable: function() {
        var sett;
        sett = this.table.fnSettings();
        sett.aaData = this.options.model.attributes[this.options.name];
        this.table.fnReloadAjax(sett);
      },
      updateUIAttuali: function(d) {
        var movement, positiveSign, target;
        positiveSign = d.movimenti > 0;
        target = this.$el.find('.statistic-values');
        target.find('span.balance').html(d.saldo);
        movement = this.$el.find('.movement');
        movement.removeClass('positive negative').addClass('movement ' + (positiveSign ? 'positive' : 'negative'));
        movement.find('.indicator').removeClass('fontello-icon-up-dir fontello-icon-down-dir').addClass(positiveSign ? 'fontello-icon-up-dir' : 'fontello-icon-down-dir');
        movement.find('sup').html(d.movimenti);
      }
    });
  });

  modulejs.define('ViewPartialsScheda', ['Q', 'jquery', 'ViewPartialsFactory'], function(Q, $, ViewPartialsFactory) {
    var ViewPartialsScheda;
    return ViewPartialsScheda = ViewPartialsFactory.extend({
      events: {
        "change input": "inputIsChanged",
        "click button": "inputIsChanged",
        "click input[type='submit']": "save"
      },
      initialize: function() {
        return this.init(this.options.active);
      },
      setAjaxUrl: function() {
        return Q.Accounts.paths.api + 'partial/' + this.options.name + '/' + this.options.model.id + '/' + Q.paths.currentpage;
      },
      render: function() {
        this.$el.html(this.templateTab({
          'account': this.options.model.toJSON()
        }));
        return this;
      },
      save: function(e) {
        var me;
        e.preventDefault();
        me = this;
        $.ajax({
          url: Q.Accounts.paths.api + 'salva/' + Q.paths.currentpage + '/' + this.options.name,
          type: 'POST',
          dataType: 'html',
          async: false,
          data: this.$el.find('form').serialize(),
          beforeSend: function() {
            return me.$el.removeClass("active");
          },
          success: function(response) {
            if (JSON.parse(response).saved) {
              me.$el.addClass("active in");
              me.modelIsSaved();
            }
          }
        });
      },
      showMap: function() {
        var activeAccount, map, mapOptions, marker;
        activeAccount = this.model.toJSON();
        if (activeAccount.latlng.lat.length === 0) {
          return false;
        }
        mapOptions = {
          center: new google.maps.LatLng(activeAccount.latlng.lat, activeAccount.latlng.lng),
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("usermap"), mapOptions);
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(activeAccount.latlng.lat, activeAccount.latlng.lng),
          map: map,
          title: activeAccount.ragione,
          clickable: true
        });
        marker.info = new google.maps.InfoWindow({
          content: '<div><h4>' + activeAccount.ragione + '</h4><p><small>Riferimento: </small><strong>' + activeAccount.nome + ' ' + activeAccount.cognome + '</strong></p><p><small>Master: </small>' + activeAccount.master + '</p></div>'
        });
        google.maps.event.addListener(marker, 'click', function() {
          return this.info.open(map, this);
        });
        return marker.setMap(map);
      },
      inputIsChanged: function(e) {
        this.tempModel.attributes.accounts[e.currentTarget.name] = e.currentTarget.value;
      },
      modelIsSaved: function() {
        this.model.set(this.tempModel.attributes);
        return this.model.trigger("saved");
      }
    });
  });

  modulejs.define('ViewAccounts', ['Q', 'jquery', 'Backbone', 'ViewSchedaEdit', 'ViewTabMenuSchede'], function(Q, $, Backbone, ViewSchedaEdit, ViewTabMenuSchede) {
    var ViewAccounts;
    return ViewAccounts = Backbone.View.extend({
      events: {
        'click .aprischeda': 'openAccountTabScheda'
      },
      initialize: function() {
        _.bindAll(this, 'render', 'addMapButton', 'mapView', 'renderInMap');
        this.listenTo(this.collection, {
          "reset": function() {
            return this.renderDataTable();
          }
        });
        this.TabMenu = new ViewTabMenuSchede({
          collection: this.collection
        });
      },
      render: function() {
        this.renderDataTable();
        return this;
      },
      renderDataTable: function() {
        var self;
        self = this;
        this.OdataTable = $(this.el).dataTable({
          aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          iDisplayLength: 20,
          aaData: this.collection.toJSON(),
          bDeferRender: false,
          bRetrieve: true,
          bIgnoreEmpty: false,
          oColumnFilterWidgets: {
            "aiExclude": [1]
          },
          aoColumns: (function() {
            var aNewData;
            aNewData = [
              {
                'mData': function(data, objs) {
                  var agente, agenzia, menuaddition, nascosto, nascosto_class, nascosto_label, nascosto_value, poker, utente;
                  menuaddition = '';
                  if (Q.paths.realm === "developer" || Q.paths.realm === 'amministrazione') {
                    agente = data.accounts.tipoutente === 'Agente' ? 'active" style="opacity:0.2"' : '"';
                    agenzia = data.accounts.tipoutente === 'Agenzia' ? 'active" style="opacity:0.2"' : '"';
                    utente = data.accounts.tipoutente === 'Utente' ? 'active" style="opacity:0.2"' : '"';
                    poker = data.accounts.tipoutente === 'Poker' ? 'active" style="opacity:0.2"' : '"';
                    if (data.accounts.nascosto === 'si') {
                      nascosto_class = 'active" style="opacity:0.3"';
                      nascosto_label = 'nascosto';
                      nascosto_value = 'no';
                    } else {
                      nascosto_class = '"';
                      nascosto_label = 'nascondi';
                      nascosto_value = 'si';
                    }
                    nascosto = data.accounts.nascosto === 'si' ? '<span class=>nascosto</span>' : '<span>nascondi</span>';
                    menuaddition = ' <a target="_blank" class="btn btn-mini btn-turgu ' + agente + ' href="' + (Q.Accounts.paths.api + 'tipoaccount/Agente/' + data.idutente) + '">Agente</a> ' + ' <a target="_blank" class="btn btn-mini btn-orange ' + agenzia + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Agenzia/' + data.idutente + '">Agenzia</a> ' + ' <a target="_blank" class="btn btn-mini btn-black ' + utente + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Utente/' + data.idutente + '">Utente</a> ' + ' <a target="_blank" class="btn btn-mini btn-boo ' + poker + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Poker/' + data.idutente + '">Poker</a> ' + '<a target="_blank" class="btn btn-mini btn-red ' + nascosto_class + ' href="' + Q.Accounts.paths.api + 'nascosto/' + nascosto_value + '/' + data.idutente + '">' + nascosto_label + '</a>';
                  }
                  return '<a class="btn btn-mini btn-yellow aprischeda" rel="' + (typeof data.uid !== 'undefined' ? data.uid : data.ragione) + '" href="#' + data.uid + '"><i class="fontello-icon-accounts-scheda"></i>Vedi</a>' + menuaddition;
                }
              }, {
                'mData': function(data) {
                  return data.idutente;
                }
              }, {
                'mData': function(data) {
                  return data.uid;
                }
              }, {
                'mData': function(data) {
                  return data.padre.uid;
                }
              }, {
                'mData': function(data) {
                  return data.accounts.ragione;
                }
              }, {
                'mData': function(data) {
                  return data.nome;
                }
              }, {
                'mData': function(data) {
                  return data.cognome;
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.comune !== 'undefined') {
                    return data.accounts.comune;
                  } else {
                    return data.citta;
                  }
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.provincia !== 'undefined') {
                    return data.accounts.provincia;
                  } else {
                    return data.provincia;
                  }
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.regione !== 'undefined') {
                    return data.accounts.regione;
                  } else {
                    return data.regione;
                  }
                }
              }, {
                'mData': function(data) {
                  return data.accounts.qshop;
                }
              }
            ];
            return aNewData;
          })(),
          oLanguage: {
            sInfoEmpty: "0 record trovati",
            sInfoFiltered: "(filtrati su un totale di _MAX_)",
            sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali",
            sSearch: "Global search: ",
            sLengthMenu: "Mostra _MENU_ risultati",
            sZeroRecords: 'Nessun record trovato'
          },
          bSortCellsTop: true,
          aaSorting: [[2, 'asc']],
          sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>",
          fnDrawCallback: function(oSettings) {
            return self.renderInMap(oSettings);
          }
        }).columnFilter({
          sPlaceHolder: 'head:after'
        });
        return this.addMapButton();
      },
      renderInMap: function(oSettings) {
        var i, model, _i, _len, _ref;
        if (this.OdataTable) {
          this.collection.forEach(function(model, index) {
            model.set('visibleInMaps', false);
          });
          _ref = oSettings.aiDisplay;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            model = this.OdataTable.fnGetData(i);
            model = this.collection.get(model.uid);
            model.set({
              'visibleInMaps': true
            });
          }
          this.mapView();
        }
      },
      updateDataTable: function() {
        this.OdataTable.fnSettings().aaData = this.collection.toJSON();
        this.OdataTable.fnReloadAjax(this.OdataTable.fnSettings());
      },
      openAccountTabScheda: function(e, tab) {
        var el, id, instance;
        if (e.currentTarget) {
          el = id = $(e.currentTarget).attr('href').slice(1);
        } else {
          id = e;
        }
        instance = 'tabScheda-' + id;
        if (Q.Accounts.Instances[instance] != null) {
          Q.Accounts.Instances[instance].view.setActive();
          return;
        }
        Q.Accounts.Instances[instance] = {
          view: new ViewSchedaEdit({
            el: '#' + instance,
            uid: id,
            viewAccounts: this,
            collection: this.collection,
            tabActive: tab
          })
        };
      },
      addMapButton: function() {
        var self;
        self = this;
        $('#lista-' + Q.paths.currentpage + '_wrapper .table-action-wrapper').html('<a href="#tabMappa" data-toggle="tab" class="btn aprilistainmappa"><i class="fontello-icon-map"></i>Apri nella mappa</a>').find('.aprilistainmappa').on('click', function(e) {
          $($(this).attr('href')).fadeIn();
          self.mapView();
          return $('body').delegate('.apri-scheda-da-mappa', 'click', function(e) {
            e.preventDefault();
            return self.openAccountTabScheda(e);
          });
        });
      },
      mapView: function() {
        var a, dataset, el, imagemarker, map, mapOptions, marker, _i, _len;
        el = document.getElementById("map-canvas-" + Q.paths.currentpage);
        mapOptions = {
          center: new google.maps.LatLng(41.871, 12.567),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(el, mapOptions);
        dataset = this.collection.filter(function(i) {
          return i.get('visibleInMaps') === true && i.get('latlng').idref !== '';
        });
        $('.mappa-accounts-valid span').html(dataset.length);
        for (_i = 0, _len = dataset.length; _i < _len; _i++) {
          a = dataset[_i];
          if ('' !== a.get('latlng').idref) {
            imagemarker = a.get('accounts').qshop === 'si' ? 'qshop' : Q.paths.currentpage;
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(a.get('latlng').lat, a.get('latlng').lng),
              map: map,
              icon: Q.paths.assets + 'q-marker-' + imagemarker + '.png',
              title: a.get('accounts').ragione,
              clickable: true
            });
          }
          marker.info = new google.maps.InfoWindow({
            content: '<div><h4>' + a.get('accounts').ragione + '</h4><p><small>Riferimento: </small><strong>' + a.get('nome') + ' ' + a.get('cognome') + '</strong></p><p><small>Master: </small>' + a.get('master') + '</p><p><a href="mailto:' + a.get('email') + '">' + a.get('email') + '</a></p></div>' + '<p><a class="apri-scheda-da-mappa" rel="' + a.get('uid') + '" href="#' + a.get('uid') + '">Apri scheda</a></p>' + '</div>'
          });
          google.maps.event.addListener(marker, 'click', function() {
            return this.info.open(map, this);
          });
          marker.setMap(map);
        }
        return window.scrollTo(0, ($('#tabMappa').position().top) - 80);
      }
    });
  });

  modulejs.define('ViewFoglinotizia', ['Q', 'jquery', 'Backbone'], function(Q, $, Backbone) {
    var ViewFoglinotizia;
    return ViewFoglinotizia = Backbone.View.extend({
      events: {
        'click .aprischeda': 'handleScheda'
      },
      initialize: function() {
        _.bindAll(this, 'render', 'mapButton', 'mapView');
        this.collection.bind("reset", this.render, this);
      },
      render: function() {
        this.dataTable();
        return this;
      },
      dataTable: function() {
        var self;
        self = this;
        this.OdataTable = $(this.el).dataTable({
          aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]],
          iDisplayLength: 20,
          aaData: this.collection.toJSON(),
          bDeferRender: true,
          bRetrieve: true,
          bIgnoreEmpty: false,
          oColumnFilterWidgets: {
            "aiExclude": [1]
          },
          aoColumns: (function() {
            var aNewData;
            aNewData = [
              {
                'mData': function(data, objs) {
                  var agente, agenzia, menuaddition, nascosto, nascosto_class, nascosto_label, nascosto_value, poker, utente;
                  menuaddition = '';
                  if (Q.paths.realm === "developer" || Q.paths.realm === 'amministrazione') {
                    agente = data.accounts.tipoutente === 'Agente' ? 'active" style="opacity:0.2"' : '"';
                    agenzia = data.accounts.tipoutente === 'Agenzia' ? 'active" style="opacity:0.2"' : '"';
                    utente = data.accounts.tipoutente === 'Utente' ? 'active" style="opacity:0.2"' : '"';
                    poker = data.accounts.tipoutente === 'Poker' ? 'active" style="opacity:0.2"' : '"';
                  }
                  if (data.accounts.nascosto === 'si') {
                    nascosto_class = 'active" style="opacity:0.3"';
                    nascosto_label = 'nascosto';
                    nascosto_value = 'no';
                  } else {
                    nascosto_class = '"';
                    nascosto_label = 'nascondi';
                    nascosto_value = 'si';
                  }
                  nascosto = data.accounts.nascosto === 'si' ? '<span class=>nascosto</span>' : '<span>nascondi</span>';
                  return menuaddition = ' <a target="_blank" class="btn btn-mini btn-turgu ' + agente + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Agente/' + data.idutente + '">Agente</a> ' + ' <a target="_blank" class="btn btn-mini btn-orange ' + agenzia + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Agenzia/' + data.idutente + '">Agenzia</a> ' + ' <a target="_blank" class="btn btn-mini btn-black ' + utente + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Utente/' + data.idutente + '">Utente</a> ' + ' <a target="_blank" class="btn btn-mini btn-boo ' + poker + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Poker/' + data.idutente + '">Poker</a> ' + '<a target="_blank" class="btn btn-mini btn-red ' + nascosto_class + ' href="' + Q.Accounts.paths.api + 'nascosto/' + nascosto_value + '/' + data.idutente + '">' + nascosto_label + '</a>' + '<a class="btn btn-mini btn-yellow aprischeda" rel="' + (typeof data.uid !== 'undefined' ? data.uid : data.ragione) + '" href="#' + data.uid + '"><i class="fontello-icon-doc-1"></i>Vedi</a>' + menuaddition;
                }
              }, {
                'mData': function(data) {
                  return data.uid;
                }
              }, {
                'mData': function(data) {
                  return data.padre.uid;
                }
              }, {
                'mData': function(data) {
                  return data.accounts.ragione;
                }
              }, {
                'mData': function(data) {
                  return data.nome;
                }
              }, {
                'mData': function(data) {
                  return data.cognome;
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.comune !== 'undefined') {
                    return data.accounts.comune;
                  } else {
                    return data.citta;
                  }
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.provincia !== 'undefined') {
                    return data.accounts.provincia;
                  } else {
                    return data.provincia;
                  }
                }
              }, {
                'mData': function(data) {
                  if (typeof data.accounts.regione !== 'undefined') {
                    return data.accounts.regione;
                  } else {
                    return data.regione;
                  }
                }
              }, {
                'mData': function(data) {
                  return data.statiutenteiso.statoutente;
                }
              }, {
                'mData': function(data) {
                  return data.datacreazione;
                }
              }
            ];
            return aNewData;
          })(),
          oLanguage: {
            sInfoEmpty: "0 record trovati",
            sInfoFiltered: "(filtrati su un totale di _MAX_)",
            sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali",
            sSearch: "Global search: ",
            sLengthMenu: "Mostra _MENU_ risultati",
            sZeroRecords: 'Nessun record trovato'
          },
          bSortCellsTop: true,
          aaSorting: [[2, 'asc']],
          sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>",
          fnDrawCallback: function(oSettings) {
            var i, model, _i, _len, _ref;
            if (self.OdataTable) {
              self.collection.forEach(function(model, index) {
                return model.set('visibleInMaps', false);
              });
              _ref = oSettings.aiDisplay;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                i = _ref[_i];
                model = self.OdataTable.fnGetData(i);
                model = self.collection.get(model.uid);
                model.set({
                  'visibleInMaps': true
                });
              }
              return self.mapView();
            }
          }
        }).columnFilter({
          sPlaceHolder: 'head:after'
        });
        return this.mapButton();
      },
      mapButton: function() {
        var self;
        self = this;
        return $('#lista-' + Q.paths.currentpage + '_wrapper .table-action-wrapper').html('<a href="#tabMappa" data-toggle="tab" class="btn aprilistainmappa"><i class="fontello-icon-map"></i>Apri nella mappa</a>').find('.aprilistainmappa').on('click', function(e) {
          $($(this).attr('href')).fadeIn();
          self.mapView();
          return $('body').delegate('.apri-scheda-da-mappa', 'click', function(e) {
            e.preventDefault();
            return self.handleScheda(e);
          });
        });
      },
      handleScheda: function(e) {
        var id, instance;
        id = $(e.currentTarget).attr('href').slice(1);
        instance = 'tabScheda-' + id;
        if (_.contains(Q.Accounts.Instances, instance)) {
          Q.Accounts.Instances[instance].load();
          return;
        }
        Q.Accounts.Instances.push(instance);
        return Q.Accounts.Instances[instance] = new Q.Accounts.V.SchedaEdit({
          el: '#' + instance,
          handlerId: id,
          handlerTabTitle: $(e.currentTarget).attr('rel'),
          tabellaView: this.OdataTable,
          collection: q.accounts.accountsCollection
        });
      },
      mapView: function() {
        var a, dataset, el, imagemarker, map, marker, _i, _len;
        el = document.getElementById("map-canvas-" + Q.paths.currentpage);
        mapOptions({
          center: new google.maps.LatLng(41.871, 12.567),
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        map = new google.maps.Map(el, mapOptions);
        dataset = this.collection.filter(function(i) {
          return i.get('visibleInMaps') === true && i.get('latlng').idref !== '';
        });
        $('.mappa-accounts-valid span').html(dataset.length);
        for (_i = 0, _len = dataset.length; _i < _len; _i++) {
          a = dataset[_i];
          if ('' !== a.get('latlng').idref) {
            imagemarker = a.get('accounts').qshop === 'si' ? 'qshop' : Q.paths.currentpage;
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(a.get('latlng').lat, a.get('latlng').lng),
              map: map,
              icon: Q.paths.assets + 'q-marker-' + imagemarker + '.png',
              title: a.get('accounts').ragione,
              clickable: true
            });
          }
          marker.info = new google.maps.InfoWindow({
            content: '<div><h4>' + a.get('accounts').ragione + '</h4><p><small>Riferimento: </small><strong>' + a.get('nome') + ' ' + a.get('cognome') + '</strong></p><p><small>Master: </small>' + a.get('master') + '</p><p><a href="mailto:' + a.get('email') + '">' + a.get('email') + '</a></p></div>' + '<p><a class="apri-scheda-da-mappa" rel="' + a.get('uid') + '" href="#' + a.get('uid') + '">Apri scheda</a></p>' + '</div>'
          });
          google.maps.event.addListener(marker, 'click', function() {
            return this.info.open(map, this);
          });
          marker.setMap(map);
        }
        return window.scrollTo(0, ($('#tabMappa').position().top) - 80);
      }
    });
  });

  modulejs.define('ViewSchedaEdit', ['Q', 'jquery', 'Backbone', 'ViewPartialsAssegni', 'ViewPartialsCallcenter', 'ViewPartialsDocumenti', 'ViewPartialsGallery', 'ViewPartialsIsolutions', 'ViewPartialsQpoints', 'ViewPartialsQshop', 'ViewPartialsScheda'], function(Q, $, Backbone, ViewPartialsAssegni, ViewPartialsCallcenter, ViewPartialsDocumenti, ViewPartialsGallery, ViewPartialsIsolutions, ViewPartialsQpoints, ViewPartialsQshop, ViewPartialsScheda) {
    var ViewSchedaEdit;
    return ViewSchedaEdit = Backbone.View.extend({
      partialsPrefix: 'ViewPartials',
      initialize: function() {
        _.bindAll(this, 'render', 'load', 'updateCollection');
        this._setModelAndActiveIt();
        this.listenTo(this.collection, {
          "reset": function() {
            return this.updateCollection();
          }
        });
        this.load();
      },
      _setModelAndActiveIt: function() {
        this.model = this.collection.get(this.options.uid);
        this.model.set({
          'active': true
        });
        this.model.on({
          "saved": this.updateCollection
        });
      },
      setActive: function() {
        this.options.viewAccounts.TabMenu.setTabSchedaAsActive(this.model.id);
        this.$el.siblings().removeClass('active in').end().addClass('active in');
      },
      loadPartials: function() {
        var c, fn, s, _i, _len, _ref;
        s = this;
        if (!s.options.tabActive) {
          s.options.tabActive = 'scheda';
        }
        _ref = this.partials;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          c = _ref[_i];
          fn = eval(this.partialsPrefix + c);
          s.partials[c] = new fn({
            mainView: s.$el,
            model: s.model,
            name: c.toLowerCase(),
            collection: s.collection,
            active: s.options.tabActive === c.toLowerCase() ? true : false
          });
        }
      },
      render: function() {
        var id, me;
        me = this;
        id = me.model.id;
        $.ajax({
          url: Q.Accounts.paths.api + 'scheda/' + Q.paths.currentpage + '/' + id,
          beforeSend: function() {
            me.$el = $('<div>').attr('id', 'tabScheda-' + id).attr('class', 'scheda-' + id + ' scheda-account tab-pane fade in');
          },
          success: function(response) {
            $('#page-content').append(me.$el.html(response));
            window.scrollTo(0, 100);
            me.options.viewAccounts.TabMenu.triggerTabClick(id);
            me.loadPartials();
          }
        });
        return this;
      },
      load: function() {
        this.options.viewAccounts.TabMenu.addTabScheda(this.model.id, this);
        this.render();
      },
      removeScheda: function() {
        delete Q.Accounts.Instances[this.options.el.substring(1)];
        this.undelegateEvents();
        this.$el.removeData().unbind();
        this.unbind();
        Backbone.View.prototype.remove.call(this);
        this.collection.unbind();
        root = $('#main-container');
        root.find('.scheda-' + this.options.uid).detach();
        root.find('#tabLista').addClass('fade in');
        if (this !== null) {
          this.remove();
        }
      },
      updateCollection: function(m) {
        this.options.viewAccounts.updateDataTable();
      }
    });
  });

  modulejs.define('ViewSchedaNew', ['Q', 'jquery', 'Backbone'], function(Q, $, Backbone) {
    var ViewSchedaNew;
    return ViewSchedaNew = Backbone.View.extend({
      events: {
        'submit .form-account-new': 'refreshScheda'
      },
      initialize: function() {
        _.bindAll(this, 'render', 'refreshScheda');
        this.collection.bind("reset", this.updateCollection, this);
        this.render();
      },
      render: function() {
        return this;
      },
      refreshScheda: function(e) {
        var formAccount, me, self;
        console.info('refresh scheda');
        e.preventDefault();
        self = this;
        me = $(this.el);
        formAccount = $('.form-account');
        return $.ajax({
          url: location.origin + '/qoffice/api/acocunts/salva/' + BetuniQ.Qoffice.page,
          type: 'POST',
          dataType: 'html',
          data: formAccount.serialize(),
          success: function(response) {
            if ($(response).length === 3) {
              me.html(response);
            } else {
              self.collection.fetch({
                reset: true
              });
            }
            self.settings = self.options.tabellaView.OdataTable.fnSettings();
            self.response = response;
          }
        });
      },
      updateCollection: function() {
        var handler, id;
        this.settings.aaData = this.collection.toJSON();
        this.options.tabellaView.OdataTable.fnReloadAjax(this.settings);
        id = $(this.response).find('form').find('input[name="id"]').val();
        handler = this.options.tabellaView.$el.find('a[href="#' + id + '"]');
        this.remove();
        this.unbind();
        this.collection.unbind();
        new BetuniQ.Qoffice.View.SchedaAccountEdit({
          handlerId: id,
          handlerTabTitle: handler.attr('rel'),
          tabellaView: this.options.tabellaView.OdataTable,
          collection: agenzieCollection
        });
      }
    });
  });

  modulejs.define('ViewTabMenuSchede', ['Q', 'jquery', 'Backbone', 'ViewSchedaNew'], function(Q, $, Backbone, ViewSchedaNew) {
    var ViewTabMenuSchede;
    return ViewTabMenuSchede = Backbone.View.extend({
      ViewsSchede: [],
      el: '#tabMenu',
      events: {
        'click #nuovo-tab': 'schedaNew',
        'click .chiudi-tabscheda': 'chiudiScheda'
      },
      initialize: function() {
        _.bindAll(this, 'render');
      },
      render: function() {},
      addTabScheda: function(id, viewCaller) {
        var li, liFrag;
        if (this.$el.find('#scheda-' + id).length) {
          false;
        }
        liFrag = document.createDocumentFragment();
        li = document.createElement("li");
        li.id = 'scheda-' + id;
        li.className = 'scheda-' + id;
        li.innerHTML = '<a href="#tabScheda-' + id + '" data-toggle="tab"><span class="title">' + id + '</span> <span rel="' + id + '" class="chiudi-tabscheda fontello-icon-cancel-circle-3"></span></a>';
        liFrag.appendChild(li);
        this.el.appendChild(liFrag);
        this.ViewsSchede[id] = viewCaller;
      },
      setTabSchedaAsActive: function(id) {
        this.$el.find('#scheda-' + id).siblings().removeClass('active in').end().addClass('active in');
      },
      chiudiScheda: function(e) {
        var id;
        id = e.currentTarget.attributes[0].nodeValue;
        this.ViewsSchede[id].removeScheda(id);
      },
      triggerTabClick: function(id) {
        this.$el.find('#scheda-' + id).find('a').trigger('click');
      },
      schedaNew: function(e) {
        new ViewSchedaNew({
          el: $(e.currentTarget).find('a').attr('href'),
          tabellaView: fogliView,
          collection: this.options.collection
        });
      }
    });
  });

  modulejs.define('initAccounts', ['Q', 'CollectionAccounts', 'ViewAccounts', 'ViewSchedaEdit'], function(Q, CollectionAccounts, ViewAccounts, ViewSchedaEdit) {
    var Router, collectionAccounts, router, viewAccounts;
    collectionAccounts = new CollectionAccounts();
    ViewSchedaEdit.prototype.partials = ['Scheda', 'Isolutions', 'Documenti', 'Callcenter', 'Qpoints', 'Gallery', 'Assegni', 'Qshop'];
    viewAccounts = new ViewAccounts({
      collection: collectionAccounts,
      el: '#lista-' + Q.paths.currentpage,
      dataTableColumns: ['uid', 'idutente', 'padre', 'ragione', 'nome', 'cognome', 'comune', 'provincia', 'regione', 'qshop']
    });
    Router = Backbone.Router.extend({
      initialize: function() {
        this.collection = collectionAccounts;
        this.route(/(.+)/, "schedaAccount");
        this.route(/^tab-(.+)$/, "tabAccount");
        return this;
      },
      schedaAccount: function(r) {
        return this.listenTo(this.collection, {
          "reset": function() {
            return viewAccounts.openAccountTabScheda(r);
          }
        });
      },
      tabAccount: function(r) {
        r = r.split('-');
        return this.listenTo(this.collection, {
          "reset": function() {
            return viewAccounts.openAccountTabScheda(r[1], r[0]);
          }
        });
      }
    });
    router = new Router;
    return Backbone.history.start();
  });

  modulejs.define('initFoglinotizia', ['Q', 'CollectionFoglinotizia', 'ViewFoglinotizia', 'ViewSchedaEdit'], function(Q, CollectionFoglinotizia, ViewFoglinotizia, ViewSchedaEdit) {
    var viewFoglinotizia;
    ViewSchedaEdit.prototype.partials = ['Scheda', 'Isolutions', 'Documenti', 'Callcenter', 'Qpoints', 'Gallery', 'Assegni', 'Qshop'];
    return viewFoglinotizia = new ViewFoglinotizia({
      collection: new CollectionFoglinotizia(),
      el: '#lista-' + Q.paths.currentpage,
      dataTableColumns: ['uid', 'idutente', 'padre', 'ragione', 'nome', 'cognome', 'comune', 'provincia', 'regione', 'qshop']
    });
  });

  Q.Accounts = {
    Instances: {},
    paths: {
      api: location.origin + '/qoffice/api/accounts/'
    }
  };

  if ((_ref = Q.paths.currentpage) === 'agenzie' || _ref === 'agenti' || _ref === 'poker' || _ref === 'utenti') {
    modulejs.require('initAccounts');
  } else {
    modulejs.require('initFoglinotizia');
  }

  $(function() {
    $("#page-content").delegate('.comune', 'keyup', function(e) {
      var citiesUl, me, val;
      if ($(this).data('active')) {
        return;
      }
      $('.autocomplete-location').addClass('hidden');
      val = e.currentTarget.value;
      me = $(this);
      citiesUl = me.parents('.controls').siblings('.cities-list');
      if (val.length < 3) {
        return;
      }
      citiesUl.empty();
      return $.ajax({
        url: Q.paths.base + 'api/rest/getComune/' + val,
        beforeSend: function() {
          me.data('active', true);
        },
        success: function(data) {
          var d, frag, li, _i, _len;
          data = JSON.parse(data);
          frag = document.createDocumentFragment();
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            d = data[_i];
            li = document.createElement("li");
            li.className = 'option_comune';
            li.setAttribute('data-prov', d.cod_provincia);
            li.setAttribute('data-istat', d.cod_istat);
            li.textContent = d.comune;
            frag.appendChild(li);
          }
          citiesUl.append(frag).fadeIn(200);
          me.data('active', false);
        }
      });
    });
    $(document).on('mouseover', '.option_comune', function(e) {
      return $("form .comune").data('valid', 'valid').val($(this).text());
    });
    $("#page-content").delegate('.comune', 'focus', function() {
      return $(this).val('');
    });
    $("#page-content").delegate('.comune', 'blur', function() {
      var citiesList, istat, prov, self, target;
      citiesList = $('.cities-list');
      self = $(this);
      if (self.val() === '' || (self.data('valid') !== 'valid')) {
        self.val($(this).attr('title'));
        $('.autocomplete-location').addClass('hidden').find('input').val('');
        citiesList.empty().fadeOut(10);
        return;
      }
      target = citiesList.find('li').filter(function() {
        return $(this).text() === self.val();
      });
      istat = target.attr('data-istat');
      prov = target.attr('data-prov');
      $.ajax({
        url: Q.paths.base + 'api/rest/getfulllocations/' + target.text() + '/' + prov + '/' + istat,
        success: function(data) {
          var holder;
          data = JSON.parse(data);
          holder = $('.autocomplete-location');
          holder.removeClass('hidden');
          holder.find('.provincia').val(data[0].provincia);
          holder.find('.regione').val(data[0].regione);
          holder.find('.cap').val(data[0].cap);
        }
      });
      return citiesList.empty().fadeOut(10);
    });
    $("#btnToggleSidebar").click(function() {
      $(this).toggleClass('fontello-icon-resize-full-2 fontello-icon-resize-small-2');
      $(this).toggleClass('active');
      $('#main-sidebar, #footer-sidebar').animate({
        width: 'toggle'
      }, 0);
      if ($('body').hasClass('sidebar-hidden')) {
        return $('body').removeClass('sidebar-hidden');
      } else {
        return $('body').addClass('sidebar-hidden');
      }
    });
    $(window).scroll(function() {
      if ($(this).scrollTop() > 100) {
        return $('#btnScrollup').fadeIn('slow');
      } else {
        return $('#btnScrollup').fadeOut(600);
      }
    });
    $('#btnScrollup').click(function() {
      $("html, body").animate({
        scrollTop: 0
      }, 500);
      return false;
    });
    $(document).on('click', '.chiudi-tabscheda', function(e) {
      $('.scheda-' + $(this).attr('rel')).detach();
      $('#lista-tab').find('a').trigger('click');
      return $('#tabLista').addClass('fade in');
    });
    return $('body').delegate('.btn-group > .btn, .btn[data-toggle="button"]', 'click', function(e) {
      var btnGroup;
      $(this).parent().siblings('#' + $(this).parent().attr('data-target')).val($(this).val());
      if ($(this).attr('class-toggle') !== void 0 && !$(this).hasClass('disabled')) {
        btnGroup = $(this).parent('.btn-group');
        if (btnGroup.attr('data-toggle') === 'buttons-radio') {
          btnGroup.find('.btn').each(function() {
            return $(this).removeClass($(this).attr('class-toggle'));
          });
          $(this).addClass($(this).attr('class-toggle'));
        }
        if (btnGroup.attr('data-toggle') === 'buttons-checkbox' || $(this).attr('data-toggle') === 'button') {
          if ($(this).hasClass('active')) {
            $(this).removeClass($(this).attr('class-toggle'));
          } else {
            $(this).addClass($(this).attr('class-toggle'));
          }
        }
      }
    });
  });

}).call(this);
