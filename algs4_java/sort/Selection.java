import com.vollen.sort.Template;
import edu.princeton.cs.algs4.*;
public class Selection extends Template{
    public static void sort(Comparable[] a){
        for(int i = 0; i < a.length - 1; i++){
            int minIndx = i;
            Comparable min = a[i];
            int j = i + 1;
            for(; j < a.length; j++){
                if(Template.less(a[j], min)){
                    min = a[j];
                    minIndx = j;
                }
            }
            if(i != j){
                Template.exch(a, i, j);
            }
        }
    }
}