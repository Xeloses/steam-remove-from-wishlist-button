// ==UserScript==
// @name         Steam: "Remove from Wishlist" button
// @description  Add "Remove from Wishlist" button to Steam store.
// @author       Xeloses
// @version      1.0
// @license      MIT
// @namespace    Xeloses.Steam.RemoveFromWishlist
// @match        https://store.steampowered.com/app/*
// @updateURL    https://github.com/Xeloses/steam-remove-from-wishlist-button/raw/master/steam-remove-from-favorites-button.user.js
// @downloadURL  https://github.com/Xeloses/steam-remove-from-wishlist-button/raw/master/steam-remove-from-favorites-button.user.js
// @grant        none
// @noframes
// @run-at       document-end
// ==/UserScript==

(function(){
    'use strict';
    if(window.self!=window.top){return}if(/https:\/\/store\.steampowered\.com\/app\/[\d]{2,}[\/]?[\S]*/i.test(window.location.href)){let _userinfo=$J('#application_config').data('userinfo');if(_userinfo&&_userinfo.logged_in){if($J('.game_area_already_owned').length){return}let _wl_container=$J('.queue_actions_ctn');if(!_wl_container||!_wl_container.length){return}let _wl_area=_wl_container.find('#add_to_wishlist_area');let _wl_s_area=_wl_container.find('#add_to_wishlist_area_success');let _wl_f_area=_wl_container.find('#add_to_wishlist_area_fail');let _SteamID=_userinfo.steamid;if(!_SteamID||!/^\d{8,20}$/.test(_SteamID)){return}let _sID=g_sessionID?g_sessionID:document.cookie.match(/(^|;)\s*sessionid\s*=\s*([^;]+)/i).pop();let _appID=window.location.href.match(/\/app\/([\d]*)\//i).pop();let _xbtn=$J('<a href="javascript:;" class="btnv6_blue_hoverfade btn_medium" title="Remove from favorites." style="margin-left:2px;"><span>✘</span></a>').click(()=>{$J.ajax({type:'POST',url:'https://store.steampowered.com/wishlist/profiles/'+_SteamID+'/remove/',data:{appid:_appID,sessionid:_sID},success:()=>{_wl_s_area.css('display','none');_wl_area.css('display','inline-block')},error:()=>{alert('Error attempt to remove app from whishlist.')}})});if(!_wl_area||!_wl_area.length){_wl_area=$J('<div id="add_to_wishlist_area" style="display: none"><a class="btnv6_blue_hoverfade btn_medium" href="javascript:AddToWishlist('+_appID+', \'add_to_wishlist_area\', \'add_to_wishlist_area_success\', \'add_to_wishlist_area_fail\', &quot;1_store-navigation__&quot;, \'add_to_wishlist_area2\' );" title="Add to whishlist."><span>Whishlist</span></a></div>');_wl_s_area=$J('<div id="add_to_wishlist_area_success"><a href="https://steamcommunity.com/id/xeloses/wishlist" class="btnv6_blue_hoverfade btn_medium queue_btn_active" title="Open Whishlist."><span><img src="https://steamstore-a.akamaihd.net/public/images/v6/ico/ico_selected.png" border="0">Whishlisted</span></a></div>');_wl_f_area=$J('<div id="add_to_wishlist_area_fail" style="display: none;"><b>Error attempt to access whishlist!</b><br />Please, retry later.</div>');let _wl_btn=_wl_container.children('a.queue_btn_active').has('img');if(_wl_btn&&_wl_btn.length){_wl_btn.remove()}_wl_container.prepend(_wl_f_area).prepend(_wl_s_area).prepend(_wl_area)}_wl_container.find('#add_to_wishlist_area_success').append(_xbtn)}}
})();