<?php
/**
 * Plugin Name: WP Data Anim
 * Description: WPブロックにdata-animアニメーション機能を追加するプラグイン
 * Version: 1.2.1
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

define( 'WP_DATA_ANIM_VERSION', '1.2.1' );

// data-anim ライブラリのバージョンを固定（CDN から取得するため意図しないアップデートを防ぐ）。
define( 'WP_DATA_ANIM_LIB_VERSION', '1.0.0' );

/**
 * Align-wide テーマサポートを追加する。
 *
 * このプラグインは full / wide 幅のアニメーションを前提とするため、
 * テーマが未対応の場合でも全幅・広幅ブロックを使えるようにする。
 */
function wp_data_anim_theme_support(): void {
	add_theme_support( 'align-wide' );
}
add_action( 'after_setup_theme', 'wp_data_anim_theme_support' );

/**
 * エディターにフィルタースクリプトを読み込む。
 */
function wp_data_anim_enqueue_editor_assets(): void {
	$asset_file = require plugin_dir_path( __FILE__ ) . 'src/editor.asset.php';

	wp_enqueue_script(
		'wp-data-anim-editor',
		plugin_dir_url( __FILE__ ) . 'src/editor.js',
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);

	wp_set_script_translations( 'wp-data-anim-editor', 'wp-data-anim', plugin_dir_path( __FILE__ ) . 'languages' );
}
add_action( 'enqueue_block_editor_assets', 'wp_data_anim_enqueue_editor_assets' );

/**
 * フロントエンドに data-anim ライブラリ（CDN）を読み込む。
 *
 * パフォーマンスのため、ページ内にアニメーション設定が存在する場合のみ読み込む。
 * CDN URL はバージョンを固定して意図しないアップデートを防ぐ。
 */
function wp_data_anim_enqueue_frontend(): void {
	global $post;

	if ( ! $post instanceof WP_Post ) {
		return;
	}

	if ( false === strpos( $post->post_content, '"dataAnim"' ) ) {
		return;
	}

	wp_enqueue_script(
		'data-anim',
		'https://unpkg.com/data-anim@' . WP_DATA_ANIM_LIB_VERSION . '/dist/data-anim.min.js',
		array(),
		WP_DATA_ANIM_LIB_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'wp_data_anim_enqueue_frontend' );

/**
 * ブロックのレンダリング時に data-* 属性を HTML へ注入する。
 *
 * getSaveContent.extraProps は静的ブロックのみ対象のため、ダイナミックブロック
 * （render_callback 使用）でも動作するよう render_block フィルターで処理する。
 *
 * @param string               $block_content レンダリングされた HTML。
 * @param array<string, mixed> $block         ブロックデータ。
 * @return string
 */
function wp_data_anim_render_block( string $block_content, array $block ): string {
	$attrs = $block['attrs'] ?? array();

	if ( empty( $attrs['dataAnim'] ) ) {
		return $block_content;
	}

	$data_attrs = array(
		'data-anim' => esc_attr( $attrs['dataAnim'] ),
	);

	if ( ! empty( $attrs['dataAnimTrigger'] ) && 'scroll' !== $attrs['dataAnimTrigger'] ) {
		$data_attrs['data-anim-trigger'] = esc_attr( $attrs['dataAnimTrigger'] );
	}
	if ( ! empty( $attrs['dataAnimDuration'] ) && 1600 !== $attrs['dataAnimDuration'] ) {
		$data_attrs['data-anim-duration'] = (int) $attrs['dataAnimDuration'];
	}
	if ( ! empty( $attrs['dataAnimDelay'] ) && 0 < $attrs['dataAnimDelay'] ) {
		$data_attrs['data-anim-delay'] = (int) $attrs['dataAnimDelay'];
	}
	if ( ! empty( $attrs['dataAnimEasing'] ) && 'ease' !== $attrs['dataAnimEasing'] ) {
		$data_attrs['data-anim-easing'] = esc_attr( $attrs['dataAnimEasing'] );
	}
	if ( isset( $attrs['dataAnimOffset'] ) && 0.2 !== $attrs['dataAnimOffset'] ) {
		$data_attrs['data-anim-offset'] = (float) $attrs['dataAnimOffset'];
	}
	if ( ! empty( $attrs['dataAnimDistance'] ) && '30px' !== $attrs['dataAnimDistance'] ) {
		$data_attrs['data-anim-distance'] = esc_attr( $attrs['dataAnimDistance'] );
	}
	if ( ! empty( $attrs['dataAnimOnce'] ) ) {
		$data_attrs['data-anim-once'] = '';
	}
	if ( ! empty( $attrs['dataAnimMirror'] ) ) {
		$data_attrs['data-anim-mirror'] = '';
	}
	if ( ! empty( $attrs['dataAnimDisable'] ) ) {
		$data_attrs['data-anim-disable'] = esc_attr( $attrs['dataAnimDisable'] );
	}

	// 属性文字列を組み立てる（値なし属性はキーのみ出力）。
	$attr_string = '';
	foreach ( $data_attrs as $key => $value ) {
		if ( '' === $value ) {
			$attr_string .= ' ' . $key;
		} else {
			$attr_string .= ' ' . $key . '="' . $value . '"';
		}
	}

	// 最初のタグの閉じ '>' の直前に属性を挿入する。
	return preg_replace( '/^(<[a-zA-Z][^>]*)>/', '$1' . $attr_string . '>', $block_content, 1 );
}
add_filter( 'render_block', 'wp_data_anim_render_block', 10, 2 );
