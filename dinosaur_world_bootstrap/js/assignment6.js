$(document).ready(function(){
 console.log('jQuery is ready!');
 const $items=$('.a6-item'); const $search=$('#a6-search');
 const names=$items.map(function(){return $(this).find('strong').text()}).get();
 const originals=$('.a6-highlight').map(function(){return {element:this,text:$(this).text()}}).get();
 function escapeRegex(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
 function search(){
  const q=$.trim($search.val()).toLowerCase();let count=0;
  $items.each(function(){const yes=$(this).attr('data-search').toLowerCase().includes(q);$(this).toggle(yes);if(yes)count++});
  originals.forEach(function(o){const $el=$(o.element);$el.empty();if(!q){$el.text(o.text);return}const regex=new RegExp('('+escapeRegex(q)+')','ig');let pos=0,match;while((match=regex.exec(o.text))!==null){$el.append(document.createTextNode(o.text.slice(pos,match.index)));$('<mark class="a6-mark">').text(match[0]).appendTo($el);pos=match.index+match[0].length} $el.append(document.createTextNode(o.text.slice(pos)))});
  $('#a6-count').text(count+' of '+$items.length+' dinosaurs shown');
  const matches=q?names.filter(n=>n.toLowerCase().includes(q)).slice(0,6):[];
  const $box=$('#a6-suggestions').empty();matches.forEach(function(n){$('<button type="button" role="option">').text(n).on('click',function(){$search.val(n);search();$box.prop('hidden',true)}).appendTo($box)});
  $box.prop('hidden',!matches.length);$search.attr('aria-expanded',String(!!matches.length));
 }
 $search.on('input keyup',search).on('keydown',function(e){if(e.key==='Escape')$('#a6-suggestions').prop('hidden',true)});search();
 $(document).on('click',function(e){if(!$(e.target).closest('.a6-search-wrap').length)$('#a6-suggestions').prop('hidden',true)});
 function progress(){const max=$(document).height()-$(window).height();$('#a6-progress').css('width',(max>0?Math.min(100,$(window).scrollTop()/max*100):100)+'%')}
 $(window).on('scroll resize',progress);progress();
 let counted=false;function counters(){if(counted||!$('.a6-counter').length)return;const top=$('.a6-counter').first().offset().top;if($(window).scrollTop()+$(window).height()<top-40)return;counted=true;$('.a6-counter').each(function(){const el=this,target=Number($(el).data('target'));$({n:0}).animate({n:target},{duration:1300,easing:'swing',step:function(v){$(el).text(Math.floor(v).toLocaleString())},complete:function(){$(el).text(target.toLocaleString()+'+')}})})}
 $(window).on('scroll resize',counters);counters();
 function toast(msg){$('.a6-toast').stop(true,true).remove();$('<div class="a6-toast" role="status">').text(msg).appendTo('body').hide().fadeIn(180).delay(2400).fadeOut(550,function(){$(this).remove()})}
 $('#a6-copy').on('click',async function(){const text=$('#a6-fact').text();try{if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);else{const input=$('<textarea>').val(text).appendTo('body').select();const ok=document.execCommand('copy');input.remove();if(!ok)throw Error('copy failed')}$(this).text('✓ Copied');$('#a6-tooltip').text('Copied to clipboard!');toast('Fact copied to clipboard!');setTimeout(()=>{$('#a6-copy').text('📋 Copy');$('#a6-tooltip').text('')},2200)}catch(e){toast('Copy unavailable: select the text manually.')}});
 // IntersectionObserver loads images only when approaching viewport.
 const lazy=document.querySelectorAll('img.a6-lazy[data-src]');function load(img){img.src=img.dataset.src;img.removeAttribute('data-src')}
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){load(e.target);observer.unobserve(e.target)}})},{rootMargin:'150px'});lazy.forEach(img=>observer.observe(img))}else{function check(){lazy.forEach(img=>{if(img.dataset.src&&img.getBoundingClientRect().top<innerHeight+150)load(img)})}$(window).on('scroll resize',check);check()}
 // Enhance the existing validated contact form without bypassing its validation.
 const $form=$('#validatedForm');if($form.length){$form.on('submit.a6',function(){const $f=$(this);setTimeout(function(){const $result=$('#formResult');if(!$result.text().trim()||/error|invalid|required|match/i.test($result.text()))return;const $btn=$f.find('[type=submit]').first();const original=$btn.html();$btn.prop('disabled',true).html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Please wait…');setTimeout(function(){$btn.prop('disabled',false).html(original);toast('Form submitted successfully!')},1400)},0)})}
 $('#subscribeForm').on('submit.a6',function(){const $btn=$(this).find('[type=submit]');const original=$btn.html();$btn.prop('disabled',true).html('<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Please wait…');setTimeout(function(){$btn.prop('disabled',false).html(original);toast('Subscription request received!')},1400)});
 $('#ratingStars button').on('click.a6',function(){toast('Thank you for your rating!')});
});