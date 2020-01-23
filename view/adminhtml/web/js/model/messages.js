/*
 * Copyright © Magenius.Team. All rights reserved.
 * See LICENSE.txt for license details.
 */

define([
    'jquery',
    'mage/template',
    'jquery/ui'
], function ($, mageTemplate) {
    'use strict';

    $.widget('mage.messageComponent', {
        options: {
            adminMessageTemplate:
                '<% _.each(data, function(messages, type) { %>' +
                '<% _.each(messages, function(message) { %>' +
                '<div class="message message-' + '<%= type %>' + ' ' + '<%= type %>' + '">' +
                '<div data-ui-id="messages-message-' + '<%= type %>' + '">' +
                '<%= message %>' +
                '</div>' +
                '</div>' +
                '<% }); %>' +
                '<% }) %>'
        },

        /**
         * @inheritdoc
         */
        _create: function () {
            $('<div id="messages"><div class="messages"></div></div>').insertBefore('[id="page:main-container"]');
            this._super();
        },

        /**
         * Add  messages to page.
         * @param messages
         */
        addMessages: function (messages) {
            var tmpl = mageTemplate(this.options.adminMessageTemplate, {
                data: messages
            });

            tmpl = $(tmpl);

            $('#messages').find('.messages')
                .prepend(tmpl)
                .trigger('contentUpdated');
        },

        /**
         * Reloads message container
         */
        reload: function () {
            var data = {
                'form_key': window.FORM_KEY
            };

            var that = this;

            $.ajax({
                type: 'POST',
                url: window.adminMessagesUrl,
                showLoader: true,
                data: data,

                success: function (response) {
                    var result = JSON.parse(response);

                    if (typeof result.error !== "undefined" || typeof result.success !== "undefined") {
                        that.addMessages(result);
                    }
                },
                error: function (jqXHR, status, error) {
                    alert({
                        content: $.mage.__('Sorry, something went wrong while reloading messages. Please try again later.')
                    });
                    window.console && console.log(status + ': ' + error + '\nResponse text:\n' + jqXHR.responseText);
                },
                complete: function () {
                    $('body').trigger('processStop');
                }
            });
        }
    });

    window.ajaxMessageUpdater = $('[id="page:main-container"]').messageComponent();
    return $.mage.messageComponent;
});
