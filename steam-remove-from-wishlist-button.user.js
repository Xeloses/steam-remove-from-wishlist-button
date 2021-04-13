// ==UserScript==
// @name         Steam: "Remove from Wishlist" button
// @description  Add "Remove from Wishlist" button to Steam store.
// @author       Xeloses
// @version      1.0.1
// @license      GPL-3.0 (https://www.gnu.org/licenses/gpl-3.0.html)
// @namespace    Xeloses.Steam.RemoveFromWishlist
// @match        https://store.steampowered.com/app/*
// @updateURL    https://raw.githubusercontent.com/Xeloses/steam-remove-from-wishlist-button/master/steam-remove-from-wishlist-button.user.js
// @downloadURL  https://raw.githubusercontent.com/Xeloses/steam-remove-from-wishlist-button/master/steam-remove-from-wishlist-button.user.js
// @grant        none
// @noframes
// @run-at       document-end
// ==/UserScript==

(function(){
    'use strict';

    if(window.self != window.top) return;

    if(/https:\/\/store\.steampowered\.com\/app\/[\d]{2,}[\/]?[\S]*/i.test(window.location.href))
    {
        // jQuery instance:
        let $J = (typeof window.$J === 'function') ? window.$J : ( (typeof window.jQuery === 'function') ? window.jQuery : null );
        if(typeof $J !== 'function') return;

        // logged user info:
        let _usr = $J('#application_config').data('userinfo');
        if(!_usr || !_usr.logged_in) return;

        // check login session:
        let _sID = window.g_sessionID ? window.g_sessionID : document.cookie.match(/(^|;)[\s]*sessionid[\s]*\=[\s]*([^;]+)/i).pop();
        if(!_sID) return;

        // logged user Steam ID:
        let _SteamID   = _usr.steamid;
        if(!_SteamID || !/^\d{8,20}$/.test(_SteamID)) return;

        // check user own current product:
        if($J('.game_area_already_owned').length) return;

        // current product App ID:
        let _appID = document.location.href.match(/\/app\/([\d]*)\//i).pop();

        // page elements:
        let $wl_container = $J('.queue_actions_ctn');
        if(!$wl_container || !$wl_container.length) return;

        let $wl_area   = $wl_container.find('#add_to_wishlist_area'),
            $wl_s_area = $wl_container.find('#add_to_wishlist_area_success'),
            $wl_f_area = $wl_container.find('#add_to_wishlist_area_fail');

        // create "Remove from Wishlist" button:
        let $xbtn = $J('<a href="javascript:;" class="btnv6_blue_hoverfade btn_medium" title="Remove from wishlist." style="margin-left:2px;"><span>✘</span></a>').click(
            ()=>{
                $J.ajax({
                    type:'POST',
                    url:'https://store.steampowered.com/wishlist/profiles/'+_SteamID+'/remove/',
                    data:{
                        appid:_appID,
                        sessionid:_sID
                    },
                    success:()=>{
                        $wl_s_area.css('display','none');
                        $wl_area.css('display','inline-block');
                    },
                    error:()=>{
                        alert('Error attempt to remove app from whishlist.');
                    }
                });
            });

        if(!$wl_area || !$wl_area.length)
        {
            $wl_area   = $J('<div id="add_to_wishlist_area" style="display: none"><a class="btnv6_blue_hoverfade btn_medium" href="javascript:AddToWishlist('+_appID+', \'add_to_wishlist_area\', \'add_to_wishlist_area_success\', \'add_to_wishlist_area_fail\', &quot;1_store-navigation__&quot;, \'add_to_wishlist_area2\' );" title="Add to whishlist."><span>Whishlist</span></a></div>');
            $wl_s_area = $J('<div id="add_to_wishlist_area_success"><a href="https://steamcommunity.com/id/xeloses/wishlist" class="btnv6_blue_hoverfade btn_medium queue_btn_active" title="Open Whishlist."><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0">Whishlisted</span></a></div>');
            $wl_f_area = $J('<div id="add_to_wishlist_area_fail" style="display: none;"><b>Error attempt to access whishlist!</b><br />Please, retry later.</div>');

            $wl_container.children('a.queue_btn_active').has('img').remove();

            $wl_container.prepend($wl_f_area).prepend($wl_s_area).prepend($wl_area);
        }

        $wl_container.find('#add_to_wishlist_area_success').append($xbtn);
    }
})();
