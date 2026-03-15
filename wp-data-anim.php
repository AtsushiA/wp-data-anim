<?php
/**
 * Plugin Name: WP Data Anim
 * Description: WPブロックにdata-animアニメーション機能を追加するプラグイン
 * Version: 1.0.0
 * Requires at least: 6.0
 * author: NExT-Season
 * author URI: https://next-season.net
 * Requires PHP: 7.4
 * Text Domain: wp-data-anim
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WP_DATA_ANIM_VERSION', '1.0.0' );

// data-anim ライブラリのバージョンを固定（CDN から取得するため意図しないアップデートを防ぐ）。
define( 'WP_DATA_ANIM_LIB_VERSION', '1.0.0' );

/**
 * ブロックを block.json から登録する
 */
function wp_data_anim_register_block(): void {
	register_block_type_from_metadata( __DIR__ );
}
add_action( 'init', 'wp_data_anim_register_block' );

/**
 * フロントエンドに data-anim ライブラリ（CDN）を読み込む。
 *
 * パフォーマンスのため、ページ内に Data Anim ブロックが存在する場合のみ読み込む。
 * CDN URL はバージョンを固定して意図しないアップデートを防ぐ。
 */
function wp_data_anim_enqueue_frontend(): void {
	if ( ! has_block( 'wp-data-anim/data-anim' ) ) {
		return;
	}

	wp_enqueue_script(
		'data-anim',
		'https://unpkg.com/data-anim@' . WP_DATA_ANIM_LIB_VERSION . '/dist/data-anim.min.js',
		[],
		WP_DATA_ANIM_LIB_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'wp_data_anim_enqueue_frontend' );
